const express = require("express");
const router = express.Router();
const { getMockZoneSeries } = require("../controllers/mokupseries");

// Get zone series
router.get("/", getMockZoneSeries);

module.exports = router;
