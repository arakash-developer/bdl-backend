const upload = require("../config/fileconfig");
const Service = require("../models/service");
const fs = require("fs");
const path = require("path");

const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createService = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    const video = req.files["video"][0].path;
    const thumbnail = req.files["thumbnail"][0].path;

    try {
      const { name } = req.body;

      const existingServices = await Service.find({});

      console.log("existingServices", existingServices);

      // If there are any existing services, delete their media files
      if (existingServices.length > 0) {
        // Delete each video's thumbnail
        if (existingServices[0].video.thumbnail) {
          deleteFile(
            path.join(
              __dirname,
              "..",
              "uploads",
              existingServices[0].video.thumbnail
            )
          );
        }
        if (existingServices[0].video.url) {
          deleteFile(
            path.join(__dirname, "..", "uploads", existingServices[0].video.url)
          );
        }
      }

      // Delete the old service (if any)
      await Service.deleteMany({}); // This will delete all services

      // Create a new service with the provided details
      const newService = new Service({
        name,
        video: {
          url: video,
          thumbnail: thumbnail,
        },
      });

      // Save the new service to the database
      await newService.save();

      // Send a successful response
      res.status(201).json(newService);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "Failed to create service",
        error: err.message,
      });
    }
  });
};

exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
