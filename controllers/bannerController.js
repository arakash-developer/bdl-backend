const upload = require("../config/fileconfig");
const Banner = require("../models/banner");
exports.getAllBanner = async (req, res) => {
  try {
    const banner = await Banner.find().sort({ _id: -1 });
    res.status(200).json(banner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBannerById = async (req, res) => {
  const { id } = req.params;
  try {
    const banner = await Banner.findById(id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }
    res.status(200).json(banner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createBanner = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ message: "title is required" });
    }

    const image = req.files["image"] ? req.files["image"][0].path : null;

    try {
      const newBanner = new Banner({
        title,
        image,
      });
      await newBanner.save();
      res.status(201).json(newBanner);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
};

exports.updateBanner = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    const { id } = req.params;
    const { title } = req.body;
    const banner = await Banner.findById(id);
    if (!title) {
      return res.status(400).json({ message: "title is required" });
    }
    const image = req.files["image"] ? req.files["image"][0].path : null;
    if (image) {
      if (banner.image && fs.existsSync(banner.image)) {
        fs.unlinkSync(banner.image);
      }
      banner.image = image;
    }
    try {
      updatedBanner.title = title;
      await updatedBanner.save();
      res.status(200).json(updatedBanner);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

exports.deleteBanner = async (req, res) => {
  const { id } = req.params;
  try {
    const banner = await Banner.findById(id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }
    if (banner.image && fs.existsSync(banner.image)) {
      fs.unlinkSync(banner.image);
    }
    await banner.remove();
    res.status(200).json({ message: "Banner deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
