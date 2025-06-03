const fs = require("fs");
const MokupzoneBanner = require("../models/mokupzoneBanner");
const upload = require("../config/fileconfig");

exports.getMokupzoneBanners = async (req, res) => {
  try {
    const { mokupzone, status = "active" } = req.query;
    const query = { status: status }; // Default to active status

    if (mokupzone) query.mokupzone = mokupzone;

    const banners = await MokupzoneBanner.find(query)
      .sort({ priority: 1 })
      .exec();

    res.status(200).json(banners);
  } catch (error) {
    console.error("Error fetching mokupzone banners:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.createMokupzoneBanner = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: "File upload error" });
    }
    try {
      const { title, status, priority, mokupzone, projectName } = req.body;
      const image = req.files["image"] ? req.files["image"][0].path : null;

      if (!image) {
        return res.status(400).json({ message: "Image is required" });
      }

      const newBanner = new MokupzoneBanner({
        title,
        image,
        status,
        priority,
        mokupzone,
        projectName,
      });

      await newBanner.save();
      res.status(201).json(newBanner);
    } catch (error) {
      console.error("Error creating mokupzone banner:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
};

exports.updateMokupzoneBanner = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    const { id } = req.params;
    const { title, priority, mokupzone, status, projectName } = req.body;

    if (!id) return res.status(400).json({ message: "ID is required" });
    if (!title) return res.status(400).json({ message: "Title is required" });
    if (!priority)
      return res.status(400).json({ message: "Priority is required" });

    try {
      const banner = await MokupzoneBanner.findById(id);
      if (!banner) {
        return res.status(404).json({ message: "Banner not found" });
      }

      const image = req.files?.["image"]?.[0]?.path || null;
      if (image) {
        if (banner.image && fs.existsSync(banner.image)) {
          fs.unlinkSync(banner.image);
        }
        banner.image = image;
      }

      banner.status = status;
      banner.title = title;
      banner.priority = priority;
      banner.mokupzone = mokupzone;
      banner.projectName = projectName;
      await banner.save();

      res.status(200).json(banner);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

exports.deleteMokupzoneBanner = async (req, res) => {
  const { id } = req.params;
  try {
    const banner = await MokupzoneBanner.findById(id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }
    if (banner.image && fs.existsSync(banner.image)) {
      fs.unlinkSync(banner.image);
    }
    await banner.deleteOne();
    res.status(200).json({ message: "Banner deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
