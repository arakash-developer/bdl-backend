const express = require("express");
const router = express.Router();
const {
  getAllInfo,
  getMessageActivity,
} = require("../controllers/homeController");

router.get("/", getAllInfo);
router.get("/message", getMessageActivity);

module.exports = router;
