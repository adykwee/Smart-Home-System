const Threshold = require("../models/thresholdModel");
const SystemLog = require("../models/systemLogModel");

const alertEngine = {
  checkThresholds: async (deviceId, feedName, value, io) => {
    try {
<<<<<<< Updated upstream
      const numericValue = parseFloat(value);
      if (isNaN(numericValue)) return;

      const thresholds = await Threshold.find({ device_id: deviceId });
      
      for (const threshold of thresholds) {
        let isViolated = false;
        let reason = "";
=======
      // 1. Lấy cấu hình ngưỡng của thiết bị từ DB
      // Note: Ở đây chúng ta tạm quy ước thiết bị sensor có chung 1 metric_type là tên feedKey
      const thresholds = await Threshold.find({ device_id: deviceId.toString() });
>>>>>>> Stashed changes

        if (threshold.min_value !== undefined && numericValue < threshold.min_value) {
          isViolated = true;
          reason = `Giá trị ${feedName} (${numericValue}) thấp hơn ngưỡng cho phép (${threshold.min_value})`;
        } else if (threshold.max_value !== undefined && numericValue > threshold.max_value) {
          isViolated = true;
          reason = `Giá trị ${feedName} (${numericValue}) vượt quá ngưỡng cho phép (${threshold.max_value})`;
        }

        if (isViolated) {
          // Ghi log vào DB
          const log = await SystemLog.create({
            event_type: "ALERT",
            description: reason,
            device_id: deviceId
          });

          console.log(`[CẢNH BÁO] ${reason}`);

<<<<<<< Updated upstream
          // Bắn sự kiện realtime sang frontend
          if (io) {
            io.emit("threshold_alert", {
              message: reason,
=======
            // 3. Emit Socket.IO (Observer Pattern)
            io.emit('threshold_alert', {
>>>>>>> Stashed changes
              device_id: deviceId,
              value: numericValue,
              threshold: threshold
            });
          }
        }
      }
    } catch (error) {
      console.error("Lỗi trong alertEngine:", error);
    }
  }
};

module.exports = alertEngine;
