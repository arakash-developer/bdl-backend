const express = require("express");
const router = express.Router();
const {
  getAllMockupZones,
  getMockupZonePaginated,
  createMockupZone,
  updateMockupZone,
  deleteMockupZone,
  getMockupZoneByZoneName,
} = require("../controllers/mockupZoneController");

router
  .get("/", getAllMockupZones)
  .get("/mockupzone-paginate/:name", getMockupZonePaginated)
  .post("/", createMockupZone)
  .patch("/:id", updateMockupZone)
  .delete("/:id", deleteMockupZone)
  .get("/:name", getMockupZoneByZoneName);

module.exports = router;
