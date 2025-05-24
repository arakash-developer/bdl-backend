const mongoose = require("mongoose");

const academySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, default: null },
    video: { type: String, default: null },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    prioroty: { type: Number, default: 1 },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Academy", academySchema);
