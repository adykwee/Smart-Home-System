const Schedule = require('../models/scheduleModel');
const systemLogRepo = require('../repositories/SystemLogRepository'); // Assuming this exists

const scheduleController = {
  getAll: async (req, res, next) => {
    try {
      // Find all schedules for the current user, or all if admin
      // Assuming we just want all schedules for demo purposes, but we can filter by user_id
      const query = req.user && req.user.role !== 'admin' ? { user_id: req.user._id } : {};
      const schedules = await Schedule.find(query).sort({ createdAt: -1 });
      res.status(200).json({ status: "success", data: schedules });
    } catch (error) { next(error); }
  },
  
  getById: async (req, res, next) => {
    try {
      const schedule = await Schedule.findById(req.params.id);
      if (!schedule) return res.status(404).json({ status: "error", message: "Không tìm thấy lịch trình" });
      res.status(200).json({ status: "success", data: schedule });
    } catch (error) { next(error); }
  },
  
  create: async (req, res, next) => {
    try {
      const { device_id, schedule_type, time_on, time_off, trigger_date, is_active } = req.body;
      const user_id = req.user ? req.user._id : 'system';
      
      const newSchedule = await Schedule.create({
        user_id,
        device_id,
        schedule_type: schedule_type || 'daily',
        time_on,
        time_off,
        trigger_date,
        is_active: is_active !== undefined ? is_active : true
      });
      
      // Log action
      if (systemLogRepo && systemLogRepo.createLog) {
        await systemLogRepo.createLog({
          event_type: 'SCHEDULE_MANAGEMENT',
          description: `Đã tạo lịch trình mới cho thiết bị [${device_id}] (Bật: ${time_on}, Tắt: ${time_off})`,
          user_id
        });
      }

      res.status(201).json({ status: "success", data: newSchedule });
    } catch (error) { next(error); }
  },
  
  update: async (req, res, next) => {
    try {
      const schedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!schedule) return res.status(404).json({ status: "error", message: "Không tìm thấy lịch trình" });
      res.status(200).json({ status: "success", data: schedule });
    } catch (error) { next(error); }
  },
  
  delete: async (req, res, next) => {
    try {
      const schedule = await Schedule.findByIdAndDelete(req.params.id);
      if (!schedule) return res.status(404).json({ status: "error", message: "Không tìm thấy lịch trình" });
      
      const user_id = req.user ? req.user._id : 'system';
      if (systemLogRepo && systemLogRepo.createLog) {
        await systemLogRepo.createLog({
          event_type: 'SCHEDULE_MANAGEMENT',
          description: `Đã xóa lịch trình của thiết bị [${schedule.device_id}]`,
          user_id
        });
      }

      res.status(200).json({ status: "success", message: "Deleted" });
    } catch (error) { next(error); }
  }
};

module.exports = scheduleController;
