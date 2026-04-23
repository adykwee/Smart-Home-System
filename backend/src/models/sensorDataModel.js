const mongoose = require("mongoose");

const sensorDataSchema = new mongoose.Schema({
  device_id: { type: mongoose.Schema.Types.ObjectId, ref: "Device", required: true },
  temperature: { type: Number },
  humidity: { type: Number },
  motion_detected: { type: Boolean },
  recorded_at: { type: Date, default: Date.now }
});

const SensorData = mongoose.model("SensorData", sensorDataSchema);
module.exports = SensorData;
