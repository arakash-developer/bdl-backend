const mongoose = require("mongoose");

const greetingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, default: null },
  image: { type: String, required: true },
  status: { type: String, enum: ["active", "inactive"], required: true },
});

module.exports = mongoose.model("Greeting", greetingSchema);
