const mongoose = require("mongoose");

const subSeriesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  series: { type: mongoose.Schema.Types.ObjectId, ref: "Series" },
});

module.exports = mongoose.model("SubSeries", subSeriesSchema);
