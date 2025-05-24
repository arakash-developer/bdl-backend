const upload = require("../config/fileconfig");
const fs = require("fs");
const path = require("path");
const Product = require("../models/product");

/**
 *
 * @param {*} req
 * @param {*} res
 * The function retrieves all products from the database and sends them as a response.
 */
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ _id: -1 })
      .populate("group")
      .populate("subSeries")
      .populate("series")
      .exec();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * The function creates a new product in the database.
 */
exports.createProduct = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    const { itemCode, subSeries, series, group, price, description } = req.body;

    console.log(subSeries);

    const image = req.files["image"] ? req.files["image"][0].path : null;

    if (!itemCode) {
      return res.status(400).json({ message: "itemCode is required" });
    }

    if (!series) {
      return res.status(400).json({ message: "series is required" });
    }
    if (!group) {
      return res.status(400).json({ message: "group is required" });
    }

    if (!image) {
      return res.status(400).json({ message: "image is required" });
    }

    if (!price) {
      return res.status(400).json({ message: "price is required" });
    }

    if (!description) {
      return res.status(400).json({ message: "description is required" });
    }

    try {
      const product = new Product({
        itemCode,
        subSeries: subSeries !== "undefined" ? subSeries : null,
        series,
        group,
        image,
        price,
        description,
      });
      const newProduct = await product.save();
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
};
/**
 *
 * @param {*} req
 * @param {*} res
 * The function updates an existing product in the database.
 */
exports.updateProduct = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    const { itemCode, subSeries, series, group, price, description } = req.body;
    const image = req.files["image"] ? req.files["image"][0].path : null;
    const { id } = req.params;
    try {
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      product.itemCode = itemCode;
      product.subSeries = subSeries !== "null" ? subSeries : null;
      product.series = series;
      product.group = group;
      product.price = price;
      product.description = description;

      if (image) {
        if (product.image && fs.existsSync(product.image)) {
          fs.unlinkSync(product.image);
        }
        product.image = image;
      }

      const updatedProduct = await product.save();
      res.status(200).json(updatedProduct);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
};

/**
 *
 * @param {*} req
 * @param {*} res
 * The function deletes an existing product from the database.
 */
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.image && fs.existsSync(product.image)) {
      fs.unlinkSync(product.image);
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * The function retrieves a single product from the database and sends it as a response.
 */
exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id)
      .populate("group")
      .populate("subSeries")
      .populate("series")
      .exec();
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * The function retrieves all products that belong to a specific series from the database and sends them as a response.
 */
exports.getProductsBySeriesId = async (req, res) => {
  const { id } = req.params;
  try {
    const products = await Product.find({ series: id })
      .populate("group")
      .populate("subSeries")
      .populate("series")
      .exec();
    if (!products) {
      return res.status(404).json({ message: "Products not found" });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * The function retrieves all products that belong to a specific subSeries from the database and sends them as a response.
 */
exports.getProductsBySubSeriesId = async (req, res) => {
  const { id } = req.params;
  try {
    const products = await Product.find({ subSeries: id })
      .populate("group")
      .populate("subSeries")
      .populate("series")
      .exec();
    if (!products) {
      return res.status(404).json({ message: "Products not found" });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * The function retrieves all products that belong to a specific group from the database and sends them as a response.
 */
exports.getProductsByGroupId = async (req, res) => {
  const { id } = req.params;
  try {
    const products = await Product.find({ group: id })
      .populate("group")
      .populate("subSeries")
      .populate("series")
      .exec();
    if (!products) {
      return res.status(404).json({ message: "Products not found" });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
