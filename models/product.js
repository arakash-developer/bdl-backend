const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  itemCode: { type: String, unique: true, required: true },
  image: { type: String, required: true },
  group: { type: Schema.Types.ObjectId, ref: "Group", required: true },
  subSeries: { type: Schema.Types.ObjectId, ref: "SubSeries", default: null },
  series: { type: Schema.Types.ObjectId, ref: "Series", required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
});

module.exports = mongoose.model("Product", productSchema);
