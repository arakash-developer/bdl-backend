const express = require("express");
const router = express.Router();
const {
  getAllAcademy,
  createAcademy,
  getAcademyById,
  updateAcademy,
  deleteAcademy,
} = require("../controllers/academyController");

router
  .get("/", getAllAcademy)
  .post("/", createAcademy)
  .get("/:id", getAcademyById)
  .patch("/:id", updateAcademy)
  .delete("/:id", deleteAcademy);
module.exports = router;
