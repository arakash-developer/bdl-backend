const upload = require("../config/fileconfig");
const Specification = require("../models/specification");
const fs = require("fs");
const path = require("path");

exports.getAllSpecification = async (req, res) => {
  try {
    const specification = await Specification.find()
      .sort({ _id: -1 })
      .populate("group")
      .populate("series")
      .populate("subSeries");
    res.status(200).json(specification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createSpecification = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    const {
      group,
      series,
      subSeries,
      priority,
      watts,
      lumens,
      beamAngle,
      rimColor,
      mounting_array,
      ip,
      glare,
      bodyColor,
      dimming,
      cct,
      dimention,
      shape,
      thickness,
      mounting,
      finish,
      customization,
      capacity,
      note,
      cri,
      protocol,
    } = req.body;

    const image = req.files["image"] ? req.files["image"][0].path : null;
    const video = req.files["video"] ? req.files["video"][0].path : null;

    if (!group) {
      return res.status(400).json({ message: "group is required" });
    }
    if (!series) {
      return res.status(400).json({ message: "series is required" });
    }
    if (!image) {
      return res.status(400).json({ message: "image is required" });
    }
    if (!video) {
      return res.status(400).json({ message: "video is required" });
    }

    console.log(req.body);

    const specification = new Specification({
      group,
      series,
      subSeries,
      priority,
      watts,
      lumens,
      beamAngle,
      rimColor,
      mounting_array,
      ip,
      glare,
      bodyColor,
      dimming,
      cct,
      dimention,
      shape,
      thickness,
      mounting,
      finish,
      customization,
      capacity,
      note,
      image,
      video,
      cri,
      protocol,
    });
    try {
      const newSpecification = await specification.save();
      res.status(201).json(newSpecification);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

exports.updateSpecification = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    const {
      group,
      series,
      subSeries,
      priority,
      watts,
      lumens,
      beamAngle,
      rimColor,
      mounting_array,
      ip,
      glare,
      bodyColor,
      dimming,
      cct,
      dimention,
      shape,
      thickness,
      mounting,
      finish,
      customization,
      capacity,
      note,
      cri,
      protocol,
    } = req.body;
    const image = req.files["image"] ? req.files["image"][0].path : null;
    const video = req.files["video"] ? req.files["video"][0].path : null;

    const { id } = req.params;

    try {
      const specification = await Specification.findById(id);

      if (!specification) {
        return res.status(404).json({ message: "Specification not found" });
      }

      specification.group = group;
      specification.series = series;
      specification.subSeries = subSeries;
      specification.priority = priority;
      specification.watts = watts;
      specification.lumens = lumens;
      specification.beamAngle = beamAngle;
      specification.rimColor = rimColor;
      specification.mounting_array = mounting_array;
      specification.ip = ip;
      specification.glare = glare;
      specification.bodyColor = bodyColor;
      specification.dimming = dimming;
      specification.cct = cct;
      specification.dimention = dimention;
      specification.shape = shape;
      specification.thickness = thickness;
      specification.mounting = mounting;
      specification.finish = finish;
      specification.customization = customization;
      specification.capacity = capacity;
      specification.note = note;
      specification.cri = cri;
      specification.protocol = protocol;

      if (image) {
        if (specification.image && fs.existsSync(specification.image)) {
          fs.unlinkSync(specification.image);
        }
        specification.image = image;
      }
      if (video) {
        if (specification.video && fs.existsSync(specification.video)) {
          fs.unlinkSync(specification.video);
        }
        specification.video = video;
      }
      const updatedSpecification = await specification.save();
      res.status(200).json(updatedSpecification);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

exports.deleteSpecification = async (req, res) => {
  const { id } = req.params;
  try {
    const specification = await Specification.findByIdAndDelete(id);
    if (!specification) {
      return res.status(404).json({ message: "Specification not found" });
    }
    if (specification.image && fs.existsSync(specification.image)) {
      fs.unlinkSync(specification.image);
    }
    if (specification.video && fs.existsSync(specification.video)) {
      fs.unlinkSync(specification.video);
    }
    res.status(200).json({ message: "Specification deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSpecificationById = async (req, res) => {
  const { id } = req.params;
  try {
    const specification = await Specification.findById(id)
      .populate("group")
      .populate("series")
      .populate("subSeries")
      .exec();
    if (!specification) {
      return res.status(404).json({ message: "Specification not found" });
    }
    res.status(200).json({ specification, message: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSpecificationsByGroupId = async (req, res) => {
  const { id } = req.params;
  try {
    const specification = await Specification.find({ group: id })
      .populate("group")
      .populate("series")
      .populate("subSeries")
      .exec();
    if (!specification) {
      return res.status(404).json({ message: "Specification not found" });
    }
    res.status(200).json(specification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSpecificationsBySeriesId = async (req, res) => {
  const { id } = req.params;
  try {
    const specification = await Specification.find({ series: id })
      .populate("group")
      .populate("series")
      .populate("subSeries")
      .exec();
    if (!specification) {
      return res.status(404).json({ message: "Specification not found" });
    }
    res.status(200).json(specification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSpecificationsBySubSeriesId = async (req, res) => {
  const { id } = req.params;
  try {
    const specification = await Specification.find({ subSeries: id })
      .populate("group")
      .populate("series")
      .populate("subSeries")
      .exec();
    if (!specification) {
      return res.status(404).json({ message: "Specification not found" });
    }
    res.status(200).json(specification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
