const fs = require("fs");

const RecentWorkBanner = require("../models/recentWorkBanner");
const upload = require("../config/fileconfig");
exports.getRecentWorkBanners = async (req, res) => {
  try {
    const banners = await RecentWorkBanner.find({ status: "active" });
    res.status(200).json(banners);
  } catch (error) {
    console.error("Error fetching recent work banners:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.createRecentWorkBanner = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: "File upload error" });
    }
    try {
      const { title, status, priority, recentWork } = req.body;
      const image = req.files["image"] ? req.files["image"][0].path : null;
      if (!image) {
        return res.status(400).json({ message: "Image is required" });
      }

      const newBanner = new RecentWorkBanner({
        title,
        image,
        status,
        priority,
        recentWork,
      });

      await newBanner.save();
      res.status(201).json(newBanner);
    } catch (error) {
      console.error("Error creating recent work banner:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
};

exports.updateRecentWorkBanner = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    const { id } = req.params;
    const { title } = req.body;
    const { priority } = req.body;
    const { recentWork } = req.body;
    const { status } = req.body;

    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }
    if (!priority) {
      return res.status(400).json({ message: "Priority is required" });
    }
    try {
      const banner = await RecentWorkBanner.findById(id);
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
      banner.recentWork = recentWork;
      await banner.save();

      res.status(200).json(banner);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

exports.deleteRecentWorkBanner = async (req, res) => {
  const { id } = req.params;
  try {
    const banner = await RecentWorkBanner.findById(id);
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
