const express = require("express");
const {
  createRecentWorkBanner,
  updateRecentWorkBanner,
  getRecentWorkBanners,
  deleteRecentWorkBanner,
} = require("../controllers/recentWorkBannerController");
const router = express.Router();

router.get("/", getRecentWorkBanners);
router.post("/", createRecentWorkBanner);
router.patch("/:id", updateRecentWorkBanner);
router.delete("/:id", deleteRecentWorkBanner);

module.exports = router;
