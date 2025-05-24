const express = require("express");
const router = express.Router();

const {
  getAllGreetings,
  createGreeting,
  updateGreeting,
  deleteGreeting,
  getGreetingById,
} = require("../controllers/greetingController");

router
  .get("/", getAllGreetings)
  .post("/", createGreeting)
  .patch("/:id", updateGreeting)
  .delete("/:id", deleteGreeting)
  .get("/:id", getGreetingById);

module.exports = router;
