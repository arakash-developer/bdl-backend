const upload = require("../config/fileconfig");
const fs = require("fs");
const path = require("path");
const SubSeries = require("../models/subSeries");

/**
 *
 * @param {*} req
 * @param {*} res
 * The function retrieves all subSeries from the database and sends them as a response.
 */
exports.getAllSubSeries = async (req, res) => {
  try {
    const subSeries = await SubSeries.find()
      .sort({ _id: -1 })
      .populate("series")
      .exec();
    res.status(200).json(subSeries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * The function creates a new subSeries in the database.
 */
exports.createSubSeries = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    const { name, series } = req.body;
    const image = req.files["image"] ? req.files["image"][0].path : null;
    if (!image) {
      return res.status(400).json({ message: "image is required" });
    }
    if (!name) {
      return res.status(400).json({ message: "name is required" });
    }
    if (!series) {
      return res.status(400).json({ message: "series is required" });
    }
    const subSeries = new SubSeries({
      name,
      image,
      series,
    });
    try {
      const newSubSeries = await subSeries.save();
      res.status(201).json({ newSubSeries, message: "success" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
};

/**
 *
 * @param {*} req
 * @param {*} res
 * The function updates a subSeries in the database.
 */
exports.updateSubSeries = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
    const { name, series } = req.body;
    const image = req.files["image"] ? req.files["image"][0].path : null;
    const { id } = req.params;
    try {
      const subSeries = await SubSeries.findById(id);
      if (!subSeries) {
        return res.status(404).json({ message: "SubSeries not found" });
      }

      if (name) {
        subSeries.name = name;
      }

      if (image) {
        if (subSeries.image && fs.existsSync(subSeries.image)) {
          fs.unlinkSync(subSeries.image);
        }
        subSeries.image = image;
      }
      if (series) {
        subSeries.series = series;
      }
      const updatedSubSeries = await subSeries.save();
      res.status(200).json({ updatedSubSeries, message: "success" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
};

/**
 *
 * @param {*} req
 * @param {*} res
 * The function deletes a subSeries from the database.
 */
exports.deleteSubSeries = async (req, res) => {
  const { id } = req.params;
  try {
    const subSeries = await SubSeries.findByIdAndDelete({ _id: id });
    if (!subSeries) {
      return res.status(404).json({ message: "SubSeries not found" });
    }
    if (subSeries.image && fs.existsSync(subSeries.image)) {
      fs.unlinkSync(subSeries.image);
    }
    res.status(200).json({ message: "SubSeries deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * The function retrieves a subSeries from the database and sends it as a response.
 */
exports.getSubSeriesById = async (req, res) => {
  const { id } = req.params;
  try {
    const subSeries = await SubSeries.findById(id).populate("series").exec();
    if (!subSeries) {
      return res.status(404).json({ message: "SubSeries not found" });
    }
    res.status(200).json(subSeries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * The function retrieves all subSeries that belong to a specific series from the database and sends them as a response.
 */
exports.getSubSeriesBySeriesId = async (req, res) => {
  const { id } = req.params;
  try {
    const subSeries = await SubSeries.find({ series: id })
      .populate("series")
      .exec();
    if (!subSeries) {
      return res.status(404).json({ message: "SubSeries not found" });
    }
    res.status(200).json(subSeries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
