const SystemLog = require("../models/systemLogModel");

const systemLogController = {
  getAll: async (req, res, next) => {
    try {
      const logs = await SystemLog.find().populate('device_id').sort({ created_at: -1 });
      res.status(200).json({ status: "success", data: logs });
    } catch (error) { next(error); }
  },
  getById: async (req, res, next) => {
    try {
      const log = await SystemLog.findById(req.params.id);
      res.status(200).json({ status: "success", data: log });
    } catch (error) { next(error); }
  },
  create: async (req, res, next) => {
    try {
      const newLog = await SystemLog.create(req.body);
      res.status(201).json({ status: "success", data: newLog });
    } catch (error) { next(error); }
  },
  update: async (req, res, next) => {
    try {
      const updated = await SystemLog.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.status(200).json({ status: "success", data: updated });
    } catch (error) { next(error); }
  },
  delete: async (req, res, next) => {
    try {
      await SystemLog.findByIdAndDelete(req.params.id);
      res.status(200).json({ status: "success", message: "Deleted" });
    } catch (error) { next(error); }
  }
};

module.exports = systemLogController;
