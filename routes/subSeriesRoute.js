const express = require("express");
const router = express.Router();

const {
  getAllSubSeries,
  createSubSeries,
  updateSubSeries,
  deleteSubSeries,
  getSubSeriesById,
  getSubSeriesBySeriesId,
} = require("../controllers/subSeriesController");

router
  .get("/", getAllSubSeries)
  .post("/", createSubSeries)
  .patch("/:id", updateSubSeries)
  .delete("/:id", deleteSubSeries)
  .get("/:id", getSubSeriesById)
  .get("/series/:id", getSubSeriesBySeriesId);

module.exports = router;
