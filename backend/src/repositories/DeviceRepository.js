const Device = require('../models/deviceModel');

class DeviceRepository {
  async findByFeedKey(feed_key) {
    // Tìm theo feed_key hoặc tên thiết bị (do Adafruit có thể gửi cả 2 lên MQTT)
    return await Device.findOne({
      $or: [
        { feed_key: feed_key },
        { name: feed_key }
      ]
    });
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
