const express = require("express");
const router = express.Router();

const {
  getAllSeries,
  createSeries,
  updateSeries,
  deleteSeries,
  getSeriesById,
  getGroupsBySeriesId,
  getSeriesByGroup,
} = require("../controllers/seriesController");

router
  .get("/", getAllSeries)
  .post("/", createSeries)
  .patch("/:id", updateSeries)
  .delete("/:id", deleteSeries)
  .get("/:id", getSeriesById)
  .get("/:id/groups", getGroupsBySeriesId)
  .get("/group/:id", getSeriesByGroup);

module.exports = router;
