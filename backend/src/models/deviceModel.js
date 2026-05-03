const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  feed_key: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  room: { type: String },
  type: { type: String },
  current_status: { type: String, default: 'OFF' }
});

// Avoid OverwriteModelError if model is compiled multiple times
const Device = mongoose.models.Device || mongoose.model('Device', deviceSchema);

module.exports = Device;
