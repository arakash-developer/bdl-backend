const express = require("express");
const router = express.Router();

const {
  getAllGroups,
  createGroup,
  updateGroup,
  deleteGroup,
  getGroupById,
} = require("../controllers/groupController");

router
  .get("/", getAllGroups)
  .post("/", createGroup)
  .patch("/:id", updateGroup)
  .delete("/:id", deleteGroup)
  .get("/:id", getGroupById);

module.exports = router;
