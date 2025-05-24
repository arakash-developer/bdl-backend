const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  createProfile,
} = require("../controllers/profileController");

router
  .get("/", getProfile)
  .patch("/:id", updateProfile)
  .post("/", createProfile);

module.exports = router;
