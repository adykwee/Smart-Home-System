const Threshold = require("../models/thresholdModel");

const thresholdController = {
  getAll: async (req, res, next) => {
    try {
      const thresholds = await Threshold.find().populate('device_id');
      res.status(200).json({ status: "success", data: thresholds });
    } catch (error) { next(error); }
  },
  getById: async (req, res, next) => {
    try {
      const threshold = await Threshold.findById(req.params.id);
      res.status(200).json({ status: "success", data: threshold });
    } catch (error) { next(error); }
  },
  create: async (req, res, next) => {
    try {
      const newThreshold = await Threshold.create(req.body);
      res.status(201).json({ status: "success", data: newThreshold });
    } catch (error) { next(error); }
  },
  update: async (req, res, next) => {
    try {
      const updated = await Threshold.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.status(200).json({ status: "success", data: updated });
    } catch (error) { next(error); }
  },
  upsertThreshold: async (req, res, next) => {
    try {
      const { metric_type, max_value, device_id } = req.body;
      let threshold = await Threshold.findOne({ metric_type });
      
      if (threshold) {
        threshold.max_value = max_value;
        if (device_id) threshold.device_id = device_id;
        await threshold.save();
      } else {
        // Nếu không có device_id, ta tìm device mặc định cho temperature
        let finalDeviceId = device_id;
        if (!finalDeviceId) {
          const Device = require("../models/deviceModel");
          const defaultDevice = await Device.findOne({ feed_key: 'temperature-sensor' });
          finalDeviceId = defaultDevice ? defaultDevice._id : null;
        }
        
        threshold = await Threshold.create({
          metric_type,
          max_value,
          device_id: finalDeviceId
        });
      }
      
      res.status(200).json({ status: "success", data: threshold });
    } catch (error) { next(error); }
  },
  getByMetricType: async (req, res, next) => {
    try {
      const threshold = await Threshold.findOne({ metric_type: req.params.type });
      res.status(200).json({ status: "success", data: threshold });
    } catch (error) { next(error); }
  },
  delete: async (req, res, next) => {
    try {
      await Threshold.findByIdAndDelete(req.params.id);
      res.status(200).json({ status: "success", message: "Deleted" });
    } catch (error) { next(error); }
  }
};

module.exports = thresholdController;
