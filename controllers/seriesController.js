const upload = require("../config/fileconfig");
const fs = require("fs");
const path = require("path");
const Series = require("../models/series");
const SubSeries = require("../models/subSeries");
/**
 *
 * @param {*} req
 * @param {*} res
 * The function retrieves all series from the database and sends them as a response.
 */
exports.getAllSeries = async (req, res) => {
  try {
    const series = await Series.find()
      .sort({ _id: -1 })
      .populate("group")
      .exec();
    res.status(200).json(series);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * The function retrieves a series by its ID from the database and sends it as a response.
 */
exports.getSeriesById = async (req, res) => {
  const { id } = req.params;
  try {
    const series = await Series.findById(id).populate("group").exec();
    if (!series) {
      return res.status(404).json({ message: "Series not found" });
    }
    res.status(200).json(series);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * The function retrieves all series that belong to a specific group from the database and sends them as a response.
 */
exports.getGroupsBySeriesId = async (req, res) => {
  const { id } = req.params;
  try {
    const series = await Series.findById(id).populate("group");
    if (!series) {
      return res.status(404).json({ message: "Series not found" });
    }
    res.status(200).json(series);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * The function creates a new series in the database.
 */
exports.createSeries = async (req, res) => {
  upload(req, res, async (err) => {
    if (!req.body) {
      return res.status(400).json({ message: "No data provided" });
    }
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    const { name, group } = req.body;
    const image = req.files["image"] ? req.files["image"][0].path : null;
    if (!image) {
      return res.status(400).json({ message: "image is required" });
    }
    if (!name) {
      return res.status(400).json({ message: "name is required" });
    }
    if (!group) {
      return res.status(400).json({ message: "group is required" });
    }
    const series = new Series({
      name: name,
      group: group,
      image: image,
    });
    try {
      const newSeries = await series.save();
      res.status(201).json({ newSeries, message: "success" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
};

/**
 *
 * @param {*} req
 * @param {*} res
 * The function updates a series in the database.
 */
exports.updateSeries = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    const { name, group } = req.body;
    console.log(name, group);
    const image = req.files["image"] ? req.files["image"][0].path : null;

    const { id } = req.params;
    try {
      const series = await Series.findById(id);
      console.log("updated", series);
      if (!series) {
        return res.status(404).json({ message: "Series not found" });
      }

      if (name) {
        series.name = name;
      }

      if (image) {
        if (series.image && fs.existsSync(series.image)) {
          fs.unlinkSync(series.image);
        }
        series.image = image;
      }
      if (group) {
        series.group = group;
      }
      const updatedSeries = await series.save();
      const populatedSeries = await Series.findById(updatedSeries._id);
      res.status(200).json(updatedSeries);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
};

/**
 *
 * @param {*} req
 * @param {*} res
 * The function deletes a series from the database.
 */
// exports.deleteSeries = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const series = await Series.findById(id);
//     if (!series) {
//       return res.status(404).json({ message: "Series not found" });
//     }
//     if (series.image && fs.existsSync(series.image)) {
//       fs.unlinkSync(series.image);
//     }
//     await series.remove();
//     res.status(200).json({ message: "Series deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

/**
 *
 * @param {*} req
 * @param {*} res
 * The function deletes a series from the database and checks if there are any associated sub-series before deleting it.
 */
exports.deleteSeries = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if there are any associated sub-series
    const associatedSubSeries = await SubSeries.findOne({ series: id });
    if (associatedSubSeries) {
      return res.status(400).json({
        message: "Cannot delete series because it has associated sub-series",
      });
    }

    // Check if the series exists
    const series = await Series.findOneAndDelete({ _id: id });
    if (!series) {
      return res.status(404).json({ message: "Series not found" });
    }

    // Delete the associated image if it exists
    if (series.image && fs.existsSync(series.image)) {
      fs.unlinkSync(series.image);
    }

    res.status(200).json({ message: "Series deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * The function retrieves all series that belong to a specific group from the database and sends them as a response.
 */
exports.getSeriesByGroup = async (req, res) => {
  const { id } = req.params;
  try {
    const series = await Series.find({ group: id }).populate("group");
    if (!series) {
      return res.status(404).json({ message: "Series not found" });
    }
    res.status(200).json(series);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
