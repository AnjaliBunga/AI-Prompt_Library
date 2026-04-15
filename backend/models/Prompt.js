const mongoose = require("mongoose");

const promptSchema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 3 },
  content: { type: String, required: true, minlength: 20 },
  complexity: { type: Number, required: true, min: 1, max: 10 },
  createdBy: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Prompt", promptSchema);
