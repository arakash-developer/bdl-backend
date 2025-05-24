const upload = require("../config/fileconfig");
const RecentWork = require("../models/recentWork");
const fs = require("fs");
const path = require("path");

exports.getAllRecentWork = async (req, res) => {
  try {
    const recentWork = await RecentWork.find().sort({ _id: -1 });
    res.status(200).json(recentWork);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * The function retrieves a recentWork from the database and sends it as a response.
 */
exports.getRecentWorkById = async (req, res) => {
  const { id } = req.params;
  try {
    const recentWork = await RecentWork.findById(id);
    res.status(200).json(recentWork);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * The function creates a new recentWork in the database.
 */
exports.createRecentWork = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.body) {
      return res.status(400).json({ message: "No data provided" });
    }

    const { title, description, client, location, series } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // Validate video and thumbnail files
    const videoFile = req.files["video"] ? req.files["video"][0].path : null;
    const thumbnailFile = req.files["thumbnail"]
      ? req.files["thumbnail"][0].path
      : null;
    const imagePaths = req.files["image"]
      ? req.files["image"].map((file) => file.path)
      : [];

    if (imagePaths.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one image is required" });
    }
    if (!videoFile) {
      return res.status(400).json({ message: "Video is required" });
    }
    if (!thumbnailFile) {
      return res.status(400).json({ message: "Thumbnail is required" });
    }

    const recentWork = new RecentWork({
      images: imagePaths,
      title: title ? title : null,
      videos: [{ video: videoFile, thumbnail: thumbnailFile }], // Single video with thumbnail
      description: description ? description : null,
      client: client ? client : null,
      location: location ? location : null,
      series: series ? series : null,
    });

    try {
      const newRecentWork = await recentWork.save();
      res.status(201).json(newRecentWork);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
};

/**
 *
 * @param {*} req
 * @param {*} res
 * The function updates a recentWork in the database.
 */
exports.updateRecentWork = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    const {
      videosToDelete = [],
      imagesToDelete = [],
      title,
      description,
      prioroty,
      status,
      client,
      location,
      series,
    } = req.body;

    // Find the recent work entry
    const recentWork = await RecentWork.findById(req.params.id);
    if (!recentWork) {
      return res.status(404).json({ message: "Recent work not found" });
    }

    // Handle deleting specified videos and their thumbnails
    if (videosToDelete && videosToDelete.length > 0) {
      for (const videoToDelete of videosToDelete) {
        const videoEntry = recentWork.videos.find(
          (video) => video.video === videoToDelete
        );
        if (videoEntry) {
          try {
            await fs.promises.unlink(
              path.join(__dirname, "..", videoEntry.thumbnail)
            );
            await fs.promises.unlink(
              path.join(__dirname, "..", videoEntry.video)
            );
          } catch (err) {
            console.error(`Error deleting files: ${err}`);
          }
        }
      }
      // Filter out the deleted videos
      recentWork.videos = recentWork.videos.filter(
        (video) => !videosToDelete.includes(video.video)
      );
    }

    // Handle deleting specified images
    if (imagesToDelete && imagesToDelete.length > 0) {
      for (const image of imagesToDelete) {
        try {
          const imagePath = path.join(__dirname, "..", image);
          await fs.promises.access(imagePath);
          await fs.promises.unlink(imagePath);
        } catch (err) {
          console.error(`Error deleting image: ${err.message}`);
        }
      }

      // Filter out the deleted images
      recentWork.images = recentWork.images.filter(
        (img) => !imagesToDelete.includes(img)
      );
    }

    // Handle uploading new videos if provided
    if (req.files["video"] && req.files["video"].length > 0) {
      const newVideoPath = req.files["video"][0].path;
      const newThumbnailPath =
        req.files["thumbnail"] && req.files["thumbnail"].length > 0
          ? req.files["thumbnail"][0].path
          : null;

      if (newThumbnailPath) {
        recentWork.videos.push({
          video: newVideoPath,
          thumbnail: newThumbnailPath,
        });
      } else {
        console.error("No thumbnail file uploaded.");
      }
    }

    // Handle uploading new images if provided
    if (req.files["image"] && req.files["image"].length > 0) {
      const images = req.files["image"].map((file) => file.path);
      recentWork.images.push(...images);
    }

    // Update other fields
    recentWork.title = title || recentWork.title;
    recentWork.description = description || recentWork.description;
    recentWork.status = status || recentWork.status;
    recentWork.prioroty = prioroty || recentWork.prioroty;
    recentWork.client = client || recentWork.client;
    recentWork.location = location || recentWork.location;
    recentWork.series = series || recentWork.series;
    recentWork.updatedAt = Date.now();

    try {
      const updatedRecentWork = await recentWork.save();
      res.status(200).json(updatedRecentWork);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
};

/**
 *
 * @param {*} req
 * @param {*} res
 * The function deletes a recentWork from the database.
 */
exports.deleteRecentWork = async (req, res) => {
  const recentWork = await RecentWork.findByIdAndDelete(req.params.id);
  if (!recentWork) {
    return res.status(404).json({ message: "Recent work not found" });
  }
  try {
    // Delete videos and thumbnails from the database
    if (recentWork.videos && recentWork.videos.length > 0) {
      recentWork.videos.forEach(async (video) => {
        try {
          await fs.promises.unlink(path.join(__dirname, "..", video.thumbnail));
          await fs.promises.unlink(path.join(__dirname, "..", video.video));
        } catch (err) {
          console.error(`Error deleting files: ${err}`);
        }
      });
    }
    // Delete images from the database
    if (recentWork.images && recentWork.images.length > 0) {
      recentWork.images.forEach(async (image) => {
        try {
          await fs.promises.unlink(path.join(__dirname, "..", image));
        } catch (err) {
          console.error(`Error deleting image: ${err}`);
        }
      });
    }
    await RecentWork.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Recent work deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
