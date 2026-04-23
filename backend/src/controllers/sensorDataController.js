const SensorData = require("../models/sensorDataModel");

const sensorDataController = {
  getLatest: async (req, res, next) => {
    try {
      const latest = await SensorData.findOne().sort({ recorded_at: -1 });
      res.status(200).json(latest || { temperature: 0 });
    } catch (error) { next(error); }
  },
  getAll: async (req, res, next) => {
    try {
      const data = await SensorData.find().populate('device_id').sort({ recorded_at: -1 }).limit(100);
      res.status(200).json({ status: "success", data });
    } catch (error) { next(error); }
  },
  getById: async (req, res, next) => {
    try {
      const data = await SensorData.findById(req.params.id);
      res.status(200).json({ status: "success", data });
    } catch (error) { next(error); }
  },
  create: async (req, res, next) => {
    try {
      const newData = await SensorData.create(req.body);
      res.status(201).json({ status: "success", data: newData });
    } catch (error) { next(error); }
  },
  update: async (req, res, next) => {
    try {
      const updated = await SensorData.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.status(200).json({ status: "success", data: updated });
    } catch (error) { next(error); }
  },
  delete: async (req, res, next) => {
    try {
      await SensorData.findByIdAndDelete(req.params.id);
      res.status(200).json({ status: "success", message: "Deleted" });
    } catch (error) { next(error); }
  }
};

module.exports = sensorDataController;
