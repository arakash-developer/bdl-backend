const upload = require("../config/fileconfig");
const Profile = require("../models/profile");
const fs = require("fs");
const path = require("path");

exports.createProfile = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    const {
      article,
      completedProjects,
      satisfiedclients,
      underConstruction,
      ongoingProjects,
      teamMembers,
      awards,
    } = req.body;

    const image = req.files["image"] ? req.files["image"][0].path : null;
    const video = req.files["video"] ? req.files["video"][0].path : null;
    const portfolio = req.files["portfolio"]
      ? req.files["portfolio"].map((file) => file.path)
      : [];

    if (!article) {
      return res.status(400).json({ message: "Article is required" });
    }
    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }
    if (!video) {
      return res.status(400).json({ message: "Video is required" });
    }

    try {
      // Fetch and delete the old profile if it exists
      const oldProfile = await Profile.findOne({});

      if (oldProfile) {
        // Delete the old image file
        if (oldProfile.image) {
          fs.unlink(path.join(__dirname, "../", oldProfile.image), (err) => {
            if (err) console.error("Failed to delete old image:", err.message);
          });
        }

        // Delete the old video file
        if (oldProfile.video) {
          fs.unlink(path.join(__dirname, "../", oldProfile.video), (err) => {
            if (err) console.error("Failed to delete old video:", err.message);
          });
        }

        // Delete the old portfolio images
        if (oldProfile.portfolio && oldProfile.portfolio.length > 0) {
          oldProfile.portfolio.forEach((file) => {
            fs.unlink(path.join(__dirname, "../", file), (err) => {
              if (err)
                console.error("Failed to delete portfolio image:", err.message);
            });
          });
        }

        // Remove the old profile from the database
        await Profile.deleteMany({});
      }

      // Create the new profile
      const profile = await Profile.create({
        article,
        completedProjects,
        satisfiedclients,
        underConstruction,
        ongoingProjects,
        teamMembers,
        awards,
        image,
        video,
        portfolio,
      });

      res.status(201).json(profile);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.find().sort({ _id: -1 });
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    const {
      article,
      completedProjects,
      satisfiedclients,
      underConstruction,
      ongoingProjects,
      teamMembers,
      awards,
      imageToDelete,
    } = req.body;

    console.log("imageToDelete", imageToDelete);

    // Find the profile entry
    const profile = await Profile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Handle updating the single video and image
    if (req.files["video"]) {
      // Delete old video if exists
      if (profile.video) {
        fs.unlink(path.join(__dirname, "..", profile.video), (err) => {
          if (err) console.error(`Error deleting video: ${profile.video}`, err);
        });
      }
      // Set new video
      profile.video = req.files["video"][0].path;
    }

    if (req.files["image"]) {
      // Delete old image if exists
      if (profile.image) {
        fs.unlink(path.join(__dirname, "..", profile.image), (err) => {
          if (err) console.error(`Error deleting image: ${profile.image}`, err);
        });
      }
      // Set new image
      profile.image = req.files["image"][0].path;
    }

    // Handle deleting specified portfolio images
    if (imageToDelete && imageToDelete.length > 0) {
      imageToDelete.forEach((imageToDelete) => {
        fs.unlink(path.join(__dirname, "..", imageToDelete), (err) => {
          if (err) console.error(`Error deleting image: ${imageToDelete}`, err);
        });
      });
      // Filter out the deleted images from portfolio array
      profile.portfolio = profile.portfolio.filter(
        (image) => !imageToDelete.includes(image)
      );
    }

    // Handle uploading new portfolio images if provided
    if (req.files["portfolio"] && req.files["portfolio"].length > 0) {
      const newImages = req.files["portfolio"].map((file) => file.path);
      profile.portfolio.push(...newImages); // Add new images to existing portfolio
    }

    // Update other fields
    profile.article = article || profile.article;
    profile.completedProjects = completedProjects || profile.completedProjects;
    profile.satisfiedclients = satisfiedclients || profile.satisfiedclients;
    profile.underConstruction = underConstruction || profile.underConstruction;
    profile.ongoingProjects = ongoingProjects || profile.ongoingProjects;
    profile.teamMembers = teamMembers || profile.teamMembers;
    profile.awards = awards || profile.awards;

    try {
      const updatedProfile = await profile.save();
      res.status(200).json(updatedProfile);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};
