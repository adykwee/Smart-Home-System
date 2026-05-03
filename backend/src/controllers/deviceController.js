const Device = require("../models/deviceModel");
const mqttClient = require("../config/mqtt");

const deviceController = {
  getAll: async (req, res, next) => {
    try {
      const devices = await Device.find();
      res.status(200).json({ status: "success", data: devices });
    } catch (error) { next(error); }
  },
  controlDevice: async (req, res, next) => {
    try {
      const { id, feedKey, trangThai } = req.body;
      const ADAFRUIT_USERNAME = process.env.AIO_USERNAME;
      const feedUrl = `${ADAFRUIT_USERNAME}/feeds/${feedKey}`;
      const giaTriGuiLen = trangThai === 'ON' ? '1' : '0';

      // 1. Gửi lệnh lên Adafruit
      mqttClient.publish(feedUrl, giaTriGuiLen, async (err) => {
        if (err) return res.status(500).json({ error: 'Lỗi MQTT' });

        // 2. Cập nhật vào DB
        await Device.findByIdAndUpdate({ _id: id }, { current_status: trangThai });
        
        // 3. Lưu lịch sử vào SystemLog (Module 4)
        const systemLogRepo = require("../repositories/SystemLogRepository");
        await systemLogRepo.createLog({
          event_type: 'ĐIỀU KHIỂN THIẾT BỊ',
          description: `Đã gửi lệnh [${trangThai}] đến thiết bị [${feedKey}]`,
          device_id: id,
          user_id: req.user ? req.user._id : null
        });

        console.log(`Đã gửi lệnh [${trangThai}] và UPDATE Database cho thiết bị ID: [${id}]`);
        res.json({ success: true, message: `Thiết bị đã được cập nhật thành ${trangThai}` });
      });
    } catch (error) { next(error); }
  },
  getById: async (req, res, next) => {
    try {
      const device = await Device.findById({ _id: req.params.id });
      res.status(200).json({ status: "success", data: device });
    } catch (error) { next(error); }
  },
  create: async (req, res, next) => {
    try {
      const device = await Device.create(req.body);
      res.status(201).json({ status: "success", data: device });
    } catch (error) { next(error); }
  },
  update: async (req, res, next) => {
    try {
      const device = await Device.findByIdAndUpdate({ _id: req.params.id }, req.body);
      res.status(200).json({ status: "success", data: device });
    } catch (error) { next(error); }
  },
  delete: async (req, res, next) => {
    try {
      await Device.findByIdAndDelete({ _id: req.params.id });
      res.status(200).json({ status: "success", message: "Deleted" });
    } catch (error) { next(error); }
  }
};

module.exports = deviceController;
