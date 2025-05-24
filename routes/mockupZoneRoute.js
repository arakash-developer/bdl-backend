const express = require("express");
const router = express.Router();
const {
  getAllMockupZones,
  createMockupZone,
  updateMockupZone,
  deleteMockupZone,
  getMockupZoneByZoneName,
} = require("../controllers/mockupZoneController");

router
  .get("/", getAllMockupZones)
  .post("/", createMockupZone)
  .patch("/:id", updateMockupZone)
  .delete("/:id", deleteMockupZone)
  .get("/:name", getMockupZoneByZoneName);

module.exports = router;
