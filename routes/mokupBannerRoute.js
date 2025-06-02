const express = require("express");
const router = express.Router();
const {
  getMokupzoneBanners,
  createMokupzoneBanner,
  updateMokupzoneBanner,
  deleteMokupzoneBanner,
} = require("../controllers/mokupzoneBanner");

// Get all banners
router.get("/", getMokupzoneBanners);

// Create new banner
router.post("/", createMokupzoneBanner);

// Update banner
router.patch("/:id", updateMokupzoneBanner);

// Delete banner
router.delete("/:id", deleteMokupzoneBanner);

module.exports = router;
