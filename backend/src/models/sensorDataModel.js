const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
  device_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
  temperature: { type: Number },
  humidity: { type: Number },
  light: { type: Number },
  motion: { type: Number },
}, { timestamps: true });

const SensorData = mongoose.models.SensorData || mongoose.model('SensorData', sensorDataSchema);

module.exports = SensorData;
