const Device = require('../models/deviceModel');

class DeviceRepository {
  async findByFeedKey(feed_key) {
    return await Device.findOne({ feed_key });
  }

  async createDevice(deviceData) {
    return await Device.create(deviceData);
  }

  async updateStatus(id, status) {
    return await Device.findByIdAndUpdate(id, { current_status: status }, { new: true });
  }

  async getAllDevices() {
    return await Device.find();
  }
}

module.exports = new DeviceRepository();
