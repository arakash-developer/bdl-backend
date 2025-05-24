const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  video: { type: String, required: true },
  article: { type: String, required: true },
  image: { type: String, required: true },

  completedProjects: {
    type: Number,
    default: 0,
  },
  satisfiedclients: {
    type: Number,
    default: 0,
  },
  underConstruction: {
    type: Number,
    default: 0,
  },
  ongoingProjects: {
    type: Number,
    default: 0,
  },
  teamMembers: {
    type: Number,
    default: 0,
  },
  awards: {
    type: Number,
    default: 0,
  },
  portfolio: {
    type: Array,
  },
});

module.exports = mongoose.model("Profile", profileSchema);
