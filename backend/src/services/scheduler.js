const scheduler = {
  // Hàm này sẽ được gọi bằng node-cron để chạy lặp vòng
  runJob: async () => {
    // Logic của bạn:
    // 1. Quét bảng `schedules` xem có lịch nào (`trigger_time`) trúng với giờ hiện tại
    // 2. Lấy `action` và gửi lệnh MQTT xuống phần cứng
    // 3. (Tùy chọn) Lưu log hành động vào `system_logs`
  }
};

module.exports = scheduler;
