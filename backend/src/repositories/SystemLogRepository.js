const SystemLog = require('../models/systemLogModel');

class SystemLogRepository {
  async createLog({ event_type, description, device_id, user_id }) {
    return await SystemLog.create({
      event_type,
      description,
      device_id,
      user_id
    });
  }

  async getAllLogs() {
    return await SystemLog.find()
      .populate('device_id', 'name feed_key')
      .populate('user_id', 'username role')
      .sort({ created_at: -1 })
      .limit(100);
  }
}

module.exports = new SystemLogRepository();
