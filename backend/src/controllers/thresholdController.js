const Threshold = require("../models/thresholdModel");
const systemLogRepo = require("../repositories/SystemLogRepository");

const thresholdController = {
  getAll: async (req, res, next) => {
    try {
      const thresholds = await Threshold.find().populate('device_id').sort({ createdAt: -1 });
      res.status(200).json({ status: "success", data: thresholds });
    } catch (error) { next(error); }
  },
  getById: async (req, res, next) => {
    try {
      const threshold = await Threshold.findById({ _id: req.params.id }).populate('device_id');
      res.status(200).json({ status: "success", data: threshold });
    } catch (error) { next(error); }
  },
  create: async (req, res, next) => {
    try {
      const threshold = await Threshold.create(req.body);
      
      // Log action
      await systemLogRepo.createLog({
        event_type: 'THRESHOLD_CHANGE',
        description: `Đã tạo ngưỡng mới cho thiết bị [${req.body.device_id}]`,
        device_id: req.body.device_id,
        user_id: req.user ? req.user._id : null
      });

      res.status(201).json({ status: "success", data: threshold });
    } catch (error) { next(error); }
  },
  update: async (req, res, next) => {
    try {
      const threshold = await Threshold.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true });
      
      // Log action
      await systemLogRepo.createLog({
        event_type: 'THRESHOLD_CHANGE',
        description: `Đã cập nhật ngưỡng cho thiết bị [${threshold.device_id}]`,
        device_id: threshold.device_id,
        user_id: req.user ? req.user._id : null
      });

      res.status(200).json({ status: "success", data: threshold });
    } catch (error) { next(error); }
  },
  delete: async (req, res, next) => {
    try {
      const threshold = await Threshold.findByIdAndDelete({ _id: req.params.id });
      if (!threshold) return res.status(404).json({ status: "error", message: "Không tìm thấy ngưỡng" });

      // Log action
      await systemLogRepo.createLog({
        event_type: 'THRESHOLD_CHANGE',
        description: `Đã xóa ngưỡng của thiết bị [${threshold.device_id}]`,
        device_id: threshold.device_id,
        user_id: req.user ? req.user._id : null
      });

      res.status(200).json({ status: "success", message: "Deleted" });
    } catch (error) { next(error); }
  }
};

module.exports = thresholdController;
