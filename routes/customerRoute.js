const express = require("express");
const router = express.Router();

const {
  getAllCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");

router
  .get("/", getAllCustomer)
  .post("/", createCustomer)
  .patch("/:id", updateCustomer)
  .delete("/:id", deleteCustomer);

module.exports = router;
