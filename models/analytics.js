const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  category: { type: String, required: true },
  value: { type: Number, required: true },
  status: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Analytics", analyticsSchema);
