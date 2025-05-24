const express = require("express");
const router = express.Router();
const {
  createSpecification,
  getAllSpecification,
  updateSpecification,
  deleteSpecification,
  getSpecificationById,
  getSpecificationsByGroupId,
  getSpecificationsBySubSeriesId,
  getSpecificationsBySeriesId,
} = require("../controllers/specificationController");

router
  .get("/", getAllSpecification)
  .post("/", createSpecification)
  .patch("/:id", updateSpecification)
  .delete("/:id", deleteSpecification)
  .get("/:id", getSpecificationById)
  .get("/group/:id", getSpecificationsByGroupId)
  .get("/sub-series/:id", getSpecificationsBySubSeriesId)
  .get("/series/:id", getSpecificationsBySeriesId);

module.exports = router;
