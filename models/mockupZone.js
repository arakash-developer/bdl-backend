const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mockupZoneVideos = new Schema({
  video: { type: String, required: true },
  thumbnail: { type: String, required: true },
});
const mockupZoneSchema = new Schema(
  {
    name: {
      type: String,
      enam: [
        "Zone-1",
        "Zone-2",
        "Zone-3",
        "Zone-4",
        "Zone-5",
        "Zone-6",
        "Zone-7",
        "Zone-8",
        "Zone-9",
        "Zone-10",
        " Zone-11",
        "Zone-12",
        "Zone-13",
        "Zone-14",
        "Zone-15",
        "Zone-16",
      ],
      required: true,
      unique: true,
    },

    images: { type: Array, required: true },
    videos: [mockupZoneVideos],
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    prioroty: { type: Number, default: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MockupZone", mockupZoneSchema);
