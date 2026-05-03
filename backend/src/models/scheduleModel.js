const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  device_id: { type: String, required: true },
  action: { type: String, required: true },
  trigger_time: { type: String, required: true },
  is_active: { type: Boolean, default: true }
});

const Schedule = mongoose.models.Schedule || mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;
