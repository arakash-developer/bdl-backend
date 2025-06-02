// akash
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mokupzoneBanner = new Schema(
  {
    title: { type: String, default: "untitled banner" },
    image: { type: String, required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    priority: { type: Number, default: 1 },
    mokupzone: {
      type: String, 
      required: true,
    },
    projectName: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("MokupzoneBanner", mokupzoneBanner);
