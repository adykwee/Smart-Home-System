const Threshold = require("../models/thresholdModel");

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
      res.status(201).json({ status: "success", data: threshold });
    } catch (error) { next(error); }
  },
  update: async (req, res, next) => {
    try {
      const threshold = await Threshold.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true });
      res.status(200).json({ status: "success", data: threshold });
    } catch (error) { next(error); }
  },
  delete: async (req, res, next) => {
    try {
      await Threshold.findByIdAndDelete({ _id: req.params.id });
      res.status(200).json({ status: "success", message: "Deleted" });
    } catch (error) { next(error); }
  }
};

module.exports = thresholdController;
