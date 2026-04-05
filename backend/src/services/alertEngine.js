const alertEngine = {
  // Hàm này sẽ dùng để kiểm tra dữ liệu cảm biến mới với các rule trong bảng `thresholds`
  checkThresholds: async (sensorData) => {
    // Logic của bạn:
    // 1. Quét tìm tất cả threshold ứng với device_id
    // 2. So sánh nhiệt độ/độ ẩm..
    // 3. Nếu lố ngưỡng thì ném vào bảng `system_logs` hoặc kích hoạt đèn còi...
  }
};

module.exports = alertEngine;
