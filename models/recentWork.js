const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recrnyWorkVideos = new Schema({
  video: { type: String, required: true },
  thumbnail: { type: String, required: true },
});
const recentWorkSchema = new Schema(
  {
    projectId: { type: String, required: true },
    images: { type: Array, required: true },
    videos: [recrnyWorkVideos],
    client: { type: String, default: null },
    location: { type: String, default: null },
    title: { type: String, required: true },
    description: { type: String, default: null },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    prioroty: { type: Number, default: 1 },
    series: {
      type: Array,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RecentWork", recentWorkSchema);
