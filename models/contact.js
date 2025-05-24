const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    url: { type: String },
    visitingCard: { type: Array },
    message: { type: String },
    status: { type: String, enum: ["read", "unread"], default: "unread" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);
