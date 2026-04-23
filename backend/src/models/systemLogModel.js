const mongoose = require("mongoose");

const systemLogSchema = new mongoose.Schema({
  event_type: { type: String, required: true },
  description: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  device_id: { type: mongoose.Schema.Types.ObjectId, ref: "Device" },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

const SystemLog = mongoose.model("SystemLog", systemLogSchema);
module.exports = SystemLog;
