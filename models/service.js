const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  video: {
    url: { type: String, required: true },
    thumbnail: { type: String, required: true },
  },
});

module.exports = mongoose.model("Service", serviceSchema);
