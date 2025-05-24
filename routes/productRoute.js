const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getProductsBySeriesId,
  getProductsBySubSeriesId,
  getProductsByGroupId,
} = require("../controllers/productController");

router
  .get("/", getAllProducts)
  .post("/", createProduct)
  .patch("/:id", updateProduct)
  .delete("/:id", deleteProduct)
  .get("/:id", getProductById)
  .get("/series/:id", getProductsBySeriesId)
  .get("/sub-series/:id", getProductsBySubSeriesId)
  .get("/group/:id", getProductsByGroupId);

module.exports = router;
