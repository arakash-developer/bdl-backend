const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const specificationSchema = new Schema({
  group: { type: Schema.Types.ObjectId, ref: "Group", required: true },
  series: { type: Schema.Types.ObjectId, ref: "Series", required: true },
  subSeries: { type: Schema.Types.ObjectId, ref: "SubSeries" },
  priority: { type: Number, default: 0 },

  watts: { type: Array },
  lumens: { type: Array },
  beamAngle: { type: Array },
  rimColor: { type: Array },
  mounting_array: { type: Array },
  ip: { type: Array },
  glare: { type: Array },
  bodyColor: { type: Array },
  dimming: { type: Array },
  cct: { type: Array },
  cri: { type: Array },

  dimention: { type: String },
  shape: { type: String },
  thickness: { type: String },
  mounting: { type: String },
  finish: { type: String },
  customization: { type: String },
  capacity: { type: String },
  protocol: { type: String },
  note: { type: String },

  image: { type: String },
  video: { type: String },
});

module.exports = mongoose.model("Specification", specificationSchema);
