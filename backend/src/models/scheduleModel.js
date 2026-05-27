const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  device_id: { type: String, required: true },
  schedule_type: { type: String, enum: ['daily', 'once'], default: 'daily' },
  time_on: { type: String, required: true },
  time_off: { type: String, required: true },
  trigger_date: { type: String }, // Format: YYYY-MM-DD
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

const Schedule = mongoose.models.Schedule || mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;
