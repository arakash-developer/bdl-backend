const exporess = require("express");
const router = exporess.Router();

const {
  getAllServices,
  createService,

  deleteService,
} = require("../controllers/serviceController");

router
  .get("/", getAllServices)
  .post("/", createService)

  .delete("/:id", deleteService);

module.exports = router;
