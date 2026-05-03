const mongoose = require('mongoose');

const thresholdSchema = new mongoose.Schema({
  device_id: { type: String, required: true },
  metric_type: { type: String, required: true },
  min_value: { type: Number },
  max_value: { type: Number }
});

const Threshold = mongoose.models.Threshold || mongoose.model('Threshold', thresholdSchema);

module.exports = Threshold;
