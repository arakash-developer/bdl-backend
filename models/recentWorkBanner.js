// akash
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const recentWorkBanner = new Schema(
  {
    title: { type: String, default: "untitled banner" },
    image: { type: String, required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    priority: { type: Number, default: 1 },
    recentWork: {
      type: Schema.Types.ObjectId,
      ref: "RecentWork",
      default: null,
    },
    recentProjectName: { type: String, default: null}, 
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("RecentWorkBanner", recentWorkBanner);
