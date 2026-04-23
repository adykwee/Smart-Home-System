const mongoose = require("mongoose");

const thresholdSchema = new mongoose.Schema({
  device_id: { type: mongoose.Schema.Types.ObjectId, ref: "Device", required: true },
  metric_type: { type: String, required: true }, // e.g. "temperature", "humidity"
  min_value: { type: Number },
  max_value: { type: Number }
});

const Threshold = mongoose.model("Threshold", thresholdSchema);
module.exports = Threshold;
