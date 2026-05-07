const SensorData = require("../models/sensorDataModel");

const sensorDataController = {
  getLatest: async (req, res, next) => {
    try {
      const latest = await SensorData.findOne().sort({ createdAt: -1 });
      res.status(200).json(latest);
    } catch (error) { next(error); }
  },
  getAll: async (req, res, next) => {
    try {
      const data = await SensorData.find().populate('device_id').sort({ createdAt: -1 }).limit(20);
      res.status(200).json({ status: "success", data: data });
    } catch (error) { next(error); }
  },
  getById: async (req, res, next) => {
    try {
      const data = await SensorData.findById({ _id: req.params.id }).populate('device_id');
      res.status(200).json({ status: "success", data: data });
    } catch (error) { next(error); }
  },
  create: async (req, res, next) => {
    try {
      const newData = await SensorData.create(req.body);
      
      // Tìm thiết bị để lấy feed_key thật
      const Device = require("../models/deviceModel");
      const device = await Device.findById(req.body.device_id);
      
      if (device) {
        const io = req.app.get("io");
        if (io) {
          // Gửi dữ liệu real-time với feed_key chuẩn
          if (req.body.temperature !== undefined) {
            io.emit("realtime_data", { feed: device.feed_key, value: req.body.temperature });
          }
          if (req.body.humidity !== undefined) {
            io.emit("realtime_data", { feed: device.feed_key, value: req.body.humidity });
          }
          if (req.body.light !== undefined) {
            io.emit("realtime_data", { feed: device.feed_key, value: req.body.light });
          }
        }
      }
      
      res.status(201).json({ status: "success", data: newData });
    } catch (error) { next(error); }
  },
  update: async (req, res, next) => {
    try {
      const data = await SensorData.findByIdAndUpdate({ _id: req.params.id }, req.body);
      res.status(200).json({ status: "success", data: data });
    } catch (error) { next(error); }
  },
  delete: async (req, res, next) => {
    try {
      await SensorData.findByIdAndDelete({ _id: req.params.id });
      res.status(200).json({ status: "success", message: "Deleted" });
    } catch (error) { next(error); }
  }
};

module.exports = sensorDataController;
