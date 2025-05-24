const express = require("express");
const router = express.Router();

const {
  getAllContacts,
  createContact,
  getContactById,
  deleteContact,
  updateContact,
} = require("../controllers/contactController");

router
  .get("/", getAllContacts)
  .post("/", createContact)
  .get("/:id", getContactById)
  .patch("/:id", updateContact)
  .delete("/:id", deleteContact);

module.exports = router;
