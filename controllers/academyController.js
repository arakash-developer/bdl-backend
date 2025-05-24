const upload = require("../config/fileconfig");
const academy = require("../models/academy");
const Academy = require("../models/academy");
const fs = require("fs");

exports.getAllAcademy = async (req, res) => {
  try {
    const academy = await Academy.find().sort({ _id: -1 });
    res.status(200).json(academy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAcademyById = async (req, res) => {
  const { id } = req.params;
  try {
    const academy = await Academy.findById(id);
    if (!academy) {
      return res.status(404).json({ message: "Academy not found" });
    }
    res.status(200).json(academy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createAcademy = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "title is required" });
    }

    if (!description) {
      return res.status(400).json({ message: "description is required" });
    }

    const image = req.files["image"] ? req.files["image"][0].path : null;
    const video = req.files["video"] ? req.files["video"][0].path : null;

    try {
      const newAcademy = new Academy({
        title,
        description,
        image,
        video,
      });

      await newAcademy.save();

      res.status(201).json(newAcademy);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

exports.updateAcademy = async (req, res) => {
  const { id } = req.params;

  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      const {
        title,
        description,
        status,
        prioroty,
        imageToDelete,
        videoToDelete,
      } = req.body;

      const updatedAcademy = await Academy.findById(id);
      if (!updatedAcademy) {
        return res.status(404).json({ message: "Academy not found" });
      }

      const image = req.files?.image ? req.files["image"][0].path : null;
      const video = req.files?.video ? req.files["video"][0].path : null;

      console.log("Image Path:", image);
      console.log("Video Path:", video);

      // Handle Image Update
      if (image) {
        if (updatedAcademy.image && fs.existsSync(updatedAcademy.image)) {
          fs.unlinkSync(updatedAcademy.image); // Use fs.promises.unlink for async
        }
        updatedAcademy.image = image;
      }

      // Handle Video Update
      if (video) {
        if (updatedAcademy.video && fs.existsSync(updatedAcademy.video)) {
          fs.unlinkSync(updatedAcademy.video); // Use fs.promises.unlink for async
        }
        updatedAcademy.video = video;
      }

      // Handle Image Deletion
      if (imageToDelete) {
        if (updatedAcademy.image && fs.existsSync(updatedAcademy.image)) {
          fs.unlinkSync(updatedAcademy.image); // Use fs.promises.unlink for async
          updatedAcademy.image = null; // Remove reference
        }
      }

      // Handle Video Deletion
      if (videoToDelete) {
        if (updatedAcademy.video && fs.existsSync(updatedAcademy.video)) {
          fs.unlinkSync(updatedAcademy.video); // Use fs.promises.unlink for async
          updatedAcademy.video = null; // Remove reference
        }
      }

      // Update other fields
      updatedAcademy.title = title;
      updatedAcademy.description = description;
      updatedAcademy.status = status;
      updatedAcademy.prioroty = prioroty;

      // Save the updated academy
      await updatedAcademy.save();

      // Send response
      res.status(200).json(updatedAcademy);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAcademy = async (req, res) => {
  const { id } = req.params;
  try {
    const academy = await Academy.findByIdAndDelete(id);
    if (!academy) {
      return res.status(404).json({ message: "Academy not found" });
    }
    if (academy.image && fs.existsSync(academy.image)) {
      fs.unlinkSync(academy.image);
    }
    if (academy.video && fs.existsSync(academy.video)) {
      fs.unlinkSync(academy.video);
    }

    res.status(200).json({ message: "Academy deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
