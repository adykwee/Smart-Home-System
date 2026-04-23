const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  device_id: { type: mongoose.Schema.Types.ObjectId, ref: "Device", required: true },
  action: { type: String, required: true },
  trigger_time: { type: String, required: true }, // e.g. "HH:mm:ss"
  is_active: { type: Boolean, default: true }
});

const Schedule = mongoose.model("Schedule", scheduleSchema);
module.exports = Schedule;
