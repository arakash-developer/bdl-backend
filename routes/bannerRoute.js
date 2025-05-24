const express = require("express");
const router = express.Router();
const {
  getAllBanner,
  createBanner,
  updateBanner,
  deleteBanner,
  getBannerById,
} = require("../controllers/bannerController");

router
  .get("/", getAllBanner)
  .post("/", createBanner)
  .patch("/:id", updateBanner)
  .delete("/:id", deleteBanner)
  .get("/:id", getBannerById);

module.exports = router;
