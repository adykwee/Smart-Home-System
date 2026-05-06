const Device = require("../models/deviceModel");
const mqttClient = require("../config/mqtt");

const deviceController = {
  getAll: async (req, res, next) => {
    try {
      const devices = await Device.find();
      res.status(200).json(devices);
    } catch (error) { next(error); }
  },
  controlDevice: async (req, res, next) => {
    try {
      const { id, feedKey, trangThai } = req.body;
      if (!id) {
        return res.status(400).json({ error: "Thiếu thông tin ID thiết bị." });
      }
      
      const ADAFRUIT_USERNAME = process.env.AIO_USERNAME;
      const feedUrl = `${ADAFRUIT_USERNAME}/feeds/${feedKey}`;
      const giaTriGuiLen = trangThai === 'ON' ? '1' : '0';

      // 1. Gửi lệnh lên Adafruit
      mqttClient.publish(feedUrl, giaTriGuiLen, async (err) => {
        if (err) return res.status(500).json({ error: 'Lỗi MQTT' });

        // 2. Cập nhật vào DB
        await Device.findByIdAndUpdate(id, { current_status: trangThai });
        console.log(`Đã gửi lệnh [${trangThai}] và UPDATE Database cho thiết bị ID: [${id}]`);
        res.json({ success: true, message: `Thiết bị đã được cập nhật thành ${trangThai}` });
      });
    } catch (error) { next(error); }
  },
  getById: async (req, res, next) => {
    try {
      const device = await Device.findById(req.params.id);
      res.status(200).json({ status: "success", data: device });
    } catch (error) { next(error); }
  },
  create: async (req, res, next) => {
    try {
      const newDevice = await Device.create(req.body);
      res.status(201).json({ status: "success", data: newDevice });
    } catch (error) { next(error); }
  },
  update: async (req, res, next) => {
    try {
<<<<<<< Updated upstream
      const updatedDevice = await Device.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.status(200).json({ status: "success", data: updatedDevice });
=======
      const device = await Device.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true });
      res.status(200).json({ status: "success", data: device });
>>>>>>> Stashed changes
    } catch (error) { next(error); }
  },
  delete: async (req, res, next) => {
    try {
      await Device.findByIdAndDelete(req.params.id);
      res.status(200).json({ status: "success", message: "Deleted" });
    } catch (error) { next(error); }
  }
};

module.exports = deviceController;
