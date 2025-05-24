const MockupZone = require("../models/mockupZone");
const upload = require("../config/fileconfig");
const fs = require("fs");
const path = require("path");

exports.getAllMockupZones = async (req, res) => {
  try {
    const mockupZones = await MockupZone.find().sort({ priority: -1 });
    res.status(200).json(mockupZones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMockupZoneByZoneName = async (req, res) => {
  const { name } = req.params;
  try {
    const mockupZone = await MockupZone.findOne({ name: name });
    res.status(200).json(mockupZone);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createMockupZone = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "name is required" });
    }

    const images = req.files["image"]
      ? req.files["image"].map((file) => file.path)
      : [];
    const video = req.files["video"] ? req.files["video"][0].path : null;
    const thumbnail = req.files["thumbnail"]
      ? req.files["thumbnail"][0].path
      : null;

    if (!video) {
      return res.status(400).json({ message: "video is required" });
    }

    if (!thumbnail) {
      return res.status(400).json({ message: "thumbnail is required" });
    }

    if (images.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one image is required" });
    }

    const mockupZone = new MockupZone({
      name,
      images: images,
      videos: [{ video: video, thumbnail: thumbnail }],
    });

    try {
      const createdMockupZone = await mockupZone.save();
      res.status(201).json(createdMockupZone);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

exports.updateMockupZone = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    console.log("Request Body:", req.body);

    const {
      videoToDelete = [],
      imageToDelete = [],
      name,
      prioroty,
      status,
    } = req.body;

    console.log("videoToDelete", videoToDelete, "imageToDelete", imageToDelete);

    const mockupZone = await MockupZone.findById(req.params.id);
    if (!mockupZone) {
      return res.status(404).json({ message: "Mockup Zone not found" });
    }

    // Delete videos and thumbnails
    if (videoToDelete.length > 0) {
      for (const video of videoToDelete) {
        const videoEntry = mockupZone.videos.find((v) => v.video === video);
        if (videoEntry) {
          try {
            const videoPath = path.join(__dirname, "..", videoEntry.video);
            const thumbnailPath = path.join(
              __dirname,
              "..",
              videoEntry.thumbnail
            );

            // Log paths for debugging
            console.log(`Attempting to delete video at: ${videoPath}`);
            console.log(`Attempting to delete thumbnail at: ${thumbnailPath}`);

            // Check if video and thumbnail exist before deleting
            await fs.promises.access(videoPath);
            await fs.promises.unlink(videoPath);
            console.log(`Deleted video: ${videoPath}`);

            await fs.promises.access(thumbnailPath);
            await fs.promises.unlink(thumbnailPath);
            console.log(`Deleted thumbnail: ${thumbnailPath}`);
          } catch (err) {
            console.error(`Error deleting video or thumbnail: ${err.message}`);
          }
        }
      }

      // Filter out the deleted videos from the database
      mockupZone.videos = mockupZone.videos.filter(
        (video) => !videoToDelete.includes(video.video)
      );
    }

    // Delete images from the database
    if (imageToDelete.length > 0) {
      for (const image of imageToDelete) {
        try {
          const imagePath = path.join(__dirname, "..", image);
          console.log(`Attempting to delete image at: ${imagePath}`);

          // Check if the image exists before deleting
          await fs.promises.access(imagePath);
          await fs.promises.unlink(imagePath);
          console.log(`Deleted image: ${imagePath}`);
        } catch (err) {
          console.error(`Error deleting image: ${err.message}`);
        }
      }

      // Filter out the deleted images
      mockupZone.images = mockupZone.images.filter(
        (img) => !imageToDelete.includes(img)
      );
    }

    // Add new images to the database
    if (req.files["image"] && req.files["image"].length > 0) {
      const images = req.files["image"].map((file) => file.path);
      mockupZone.images = [...mockupZone.images, ...images];
    }

    // Add new videos and thumbnails to the database
    if (req.files["video"] && req.files["video"].length > 0) {
      const newVideo = req.files["video"][0].path;
      const newThumbnail =
        req.files["thumbnail"] && req.files["thumbnail"].length > 0
          ? req.files["thumbnail"][0].path
          : null;

      if (newThumbnail) {
        mockupZone.videos.push({ video: newVideo, thumbnail: newThumbnail });
      } else {
        console.error("No thumbnail file uploaded.");
      }
    }

    // Update other fields
    mockupZone.name = name || mockupZone.name;
    mockupZone.prioroty = prioroty || mockupZone.prioroty;
    mockupZone.status = status || mockupZone.status;

    try {
      const updatedMockupZone = await mockupZone.save();
      res.status(200).json(updatedMockupZone);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

exports.deleteMockupZone = async (req, res) => {
  try {
    // Find the MockupZone by ID
    const mockupZone = await MockupZone.findByIdAndDelete(req.params.id);
    if (!mockupZone) {
      return res.status(404).json({ message: "Mockup Zone not found" });
    }

    // Delete associated videos and thumbnails
    for (const videoEntry of mockupZone.videos) {
      try {
        const videoPath = path.join(__dirname, "..", videoEntry.video);
        const thumbnailPath = path.join(__dirname, "..", videoEntry.thumbnail);

        // Delete video
        await fs.promises.access(videoPath); // Check if video exists
        await fs.promises.unlink(videoPath); // Delete video

        // Delete thumbnail
        await fs.promises.access(thumbnailPath); // Check if thumbnail exists
        await fs.promises.unlink(thumbnailPath); // Delete thumbnail
      } catch (err) {
        console.error(`Error deleting video or thumbnail: ${err.message}`);
      }
    }

    // Delete associated images
    for (const image of mockupZone.images) {
      try {
        const imagePath = path.join(__dirname, "..", image);
        // Check if the image exists before deleting
        await fs.promises.access(imagePath);
        await fs.promises.unlink(imagePath);
      } catch (err) {
        console.error(`Error deleting image: ${err.message}`);
      }
    }

    // Delete the MockupZone from the databas

    // Send a success response
    res.status(200).json({ message: "Mockup Zone deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
