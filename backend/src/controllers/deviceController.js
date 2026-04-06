const DeviceModel = require("../models/deviceModel");
const mqttClient = require("../config/mqtt");

const deviceController = {
  getAll: async (req, res, next) => {
    try {
      const devices = await DeviceModel.getAll();
      res.status(200).json(devices);
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
        await DeviceModel.updateStatus(id, trangThai);
        console.log(`Đã gửi lệnh [${trangThai}] và UPDATE Database cho thiết bị ID: [${id}]`);
        res.json({ success: true, message: `Thiết bị đã được cật nhật thành ${trangThai}` });
      });
    } catch (error) { next(error); }
  },
  getById: async (req, res, next) => {
    try { res.status(200).json({ status: "success", data: {} }); } catch (error) { next(error); }
  },
  create: async (req, res, next) => {
    try { res.status(201).json({ status: "success", data: {} }); } catch (error) { next(error); }
  },
  update: async (req, res, next) => {
    try { res.status(200).json({ status: "success", data: {} }); } catch (error) { next(error); }
  },
  delete: async (req, res, next) => {
    try { res.status(200).json({ status: "success", message: "Deleted" }); } catch (error) { next(error); }
  }
};

module.exports = deviceController;
