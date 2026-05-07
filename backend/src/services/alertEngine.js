const Threshold = require("../models/thresholdModel");
const systemLogRepo = require("../repositories/SystemLogRepository");

// --- STRATEGY PATTERN ---

// Giao diện (Interface) chung cho mọi Strategy kiểm tra cảnh báo
class AlertStrategy {
  check(value, threshold) {
    throw new Error("Method 'check()' must be implemented.");
  }
}

// Concrete Strategy 1: Kiểm tra vượt ngưỡng trên (Max)
class MaxThresholdStrategy extends AlertStrategy {
  check(value, threshold) {
    if (threshold.max_value !== undefined && threshold.max_value !== null) {
      if (value > threshold.max_value) {
        return `Vượt ngưỡng cảnh báo trên! Giá trị hiện tại: ${value}, Ngưỡng tối đa: ${threshold.max_value}`;
      }
    }
    return null;
  }
}

// Concrete Strategy 2: Kiểm tra vượt ngưỡng dưới (Min)
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

// Context Class
class AlertContext {
  constructor() {
    this.strategies = [new MaxThresholdStrategy(), new MinThresholdStrategy()];
  }

  async checkThresholds(deviceId, feedKey, value, io) {
    try {
      // 1. Lấy cấu hình ngưỡng của thiết bị từ DB
      // Đảm bảo deviceId là string để query chính xác
      const deviceIdStr = deviceId.toString();
      const thresholds = await Threshold.find({ device_id: deviceIdStr });
      
      console.log(`[AlertEngine] Đang kiểm tra ${thresholds.length} ngưỡng cho thiết bị ${deviceIdStr} (Giá trị: ${value})`);

      for (let threshold of thresholds) {
        for (let strategy of this.strategies) {
          const alertMessage = strategy.check(value, threshold);

          if (alertMessage) {
            console.log(`[ALERT] Thiết bị ${deviceIdStr}: ${alertMessage}`);

            // 2. Ghi Log Cảnh Báo (Sử dụng Repository) - Dùng 'ALERT' để đồng bộ với Frontend
            await systemLogRepo.createLog({
              event_type: 'ALERT',
              description: `[${feedKey}] ${alertMessage}`,
              device_id: deviceId
            });

            // 3. Emit Socket.IO (Observer Pattern)
            io.emit('alert', {
              device_id: deviceId,
              feed: feedKey,
              message: alertMessage,
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
