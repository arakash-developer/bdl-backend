const express = require("express");
const router = express.Router();

const {
  getAllRecentWork,
  createRecentWork,
  updateRecentWork,
  deleteRecentWork,
  getRecentWorkById,
} = require("../controllers/recentWorkController");

router
  .get("/", getAllRecentWork)
  .post("/", createRecentWork)
  .patch("/:id", updateRecentWork)
  .delete("/:id", deleteRecentWork)
  .get("/:id", getRecentWorkById);

module.exports = router;
