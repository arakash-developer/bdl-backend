const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  customerCode: {
    type: String,
    required: true,
    unique: true,
  },
  customerCategory: {
    type: String,
    enum: ["A", "B", "C", "D", "E", "F"],
    required: true,
  },
  profession: {
    type: String,
    enum: ["Engineer", "Architect", "Electrician", "Others"],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  discount: {
    type: Number,
    default: 0,
  },
  remarks: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model("Customer", customerSchema);
