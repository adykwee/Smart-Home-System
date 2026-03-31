const mqttClient = require("../config/mqtt");
const LogModel = require("../models/logModel");

const ADAFRUIT_USERNAME = process.env.AIO_USERNAME;

const deviceController = {
  controlDevice: async (req, res) => {
    const { device_id, command } = req.body; // command: 'ON' hoặc 'OFF'

    if (!device_id || !command) {
      return res
        .status(400)
        .json({ error_code: "BAD_REQUEST", message: "Thiếu dữ liệu" });
    }

    const feedKey =
      device_id === "den_phong_khach" ? "den-led" : "thiet-bi-khac";
    const valueToPublish = command === "ON" ? "1" : "0";

    try {
      // 1. Publish lệnh lên Adafruit IO
      mqttClient.publish(
        `${ADAFRUIT_USERNAME}/feeds/${feedKey}`,
        valueToPublish,
      );

      // 2. Ghi log xuống Database (Trạng thái pending hoặc sent)
      await LogModel.insertLog(device_id, command, "SENT");

      // Lưu ý: Để đơn giản cho MVP, chúng ta giả định Publish thành công là HTTP 200.
      // (Nếu muốn code chuẩn Timeout 3s khắt khe như Architecture Doc, bạn sẽ cần dùng
      // Promise kết hợp setTimeout lắng nghe sự kiện trả về từ Webhook ở đây).

      return res.status(200).json({
        status: "success",
        message: `Đã gửi lệnh ${command} tới ${device_id}`,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error_code: "SERVER_ERROR", message: error.message });
    }
  },
};

module.exports = deviceController;
