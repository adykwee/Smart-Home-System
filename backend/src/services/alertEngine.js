const Threshold = require("../models/thresholdModel");
const systemLogRepo = require("../repositories/SystemLogRepository");

class AlertStrategy {
  check(value, threshold) {
    throw new Error("Method 'check()' must be implemented.");
  }
}

class MaxThresholdStrategy extends AlertStrategy {
  check(value, threshold) {
    if (threshold.max_value !== undefined && threshold.max_value !== null) {
      if (value > threshold.max_value) {
        return `Vượt ngưỡng cảnh báo! Giá trị hiện tại: ${value}, Ngưỡng tối đa: ${threshold.max_value}`;
      }
    }
    return null;
  }
}

class MinThresholdStrategy extends AlertStrategy {
  check(value, threshold) {
    if (threshold.min_value !== undefined && threshold.min_value !== null) {
      if (value < threshold.min_value) {
        return `Dưới ngưỡng cảnh báo! Giá trị hiện tại: ${value}, Ngưỡng tối thiểu: ${threshold.min_value}`;
      }
    }
    return null;
  }
}

class AlertContext {
  constructor() {
    this.strategies = [new MaxThresholdStrategy(), new MinThresholdStrategy()];
  }

  async checkThresholds(deviceId, feedKey, value, io) {
    try {
      const deviceIdStr = deviceId.toString();
      const thresholds = await Threshold.find({ device_id: deviceIdStr });
      
      console.log(`[AlertEngine] Đang kiểm tra ${thresholds.length} ngưỡng cho thiết bị ${deviceIdStr} (Giá trị: ${value})`);

      for (let threshold of thresholds) {
        for (let strategy of this.strategies) {
          const alertMessage = strategy.check(value, threshold);

          if (alertMessage) {
            let metricName = "Cảm biến";
            if (threshold.metric_type === "temperature") metricName = "Nhiệt độ";
            else if (threshold.metric_type === "humidity") metricName = "Độ ẩm";
            else if (threshold.metric_type === "light") metricName = "Ánh sáng";

            const formattedMessage = `[Cảnh báo ${metricName}] ${alertMessage}`;
            console.log(`[ALERT] ${deviceIdStr}: ${formattedMessage}`);

            // Lưu log cảnh báo vào DB
            await systemLogRepo.createLog({
              event_type: 'ALERT',
              description: `[${feedKey}] ${formattedMessage}`,
              device_id: deviceId
            });

            // Gửi thông báo real-time qua socket
            io.emit('alert', {
              device_id: deviceId,
              feed: feedKey,
              message: formattedMessage,
              timestamp: new Date()
            });
          }
        }
      }
    } catch (error) {
      console.error("Lỗi Alert Engine:", error);
    }
  }
}

module.exports = new AlertContext();
