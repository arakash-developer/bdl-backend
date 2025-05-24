const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  loginUser,
} = require("../controllers/userController");

router
  .get("/", getAllUsers)
  .post("/register", createUser)
  .patch("/:id", updateUser)
  .delete("/:id", deleteUser)
  .get("/:id", getUserById)
  .post("/login", loginUser);

module.exports = router;
