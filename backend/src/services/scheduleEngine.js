const cron = require('node-cron');
const Schedule = require('../models/scheduleModel');
const Device = require('../models/deviceModel');
const mqttClient = require('../config/mqtt');
const systemLogRepo = require('../repositories/SystemLogRepository');

const startScheduleEngine = (io) => {
  // Chạy mỗi phút
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      // Lấy giờ phút hiện tại: HH:mm (cần timezone đúng, ở đây giả định local server time)
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTime = `${currentHours}:${currentMinutes}`;
      
      const currentYear = now.getFullYear();
      const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
      const currentDay = String(now.getDate()).padStart(2, '0');
      const currentDate = `${currentYear}-${currentMonth}-${currentDay}`;

      // Tìm các lịch trình đang active và có time_on HOẶC time_off bằng thời gian hiện tại
      const schedules = await Schedule.find({
        is_active: true,
        $or: [{ time_on: currentTime }, { time_off: currentTime }]
      });

      for (let schedule of schedules) {
        let actionToTrigger = null;

        if (schedule.schedule_type === 'once') {
          // Chỉ trigger nếu đúng ngày
          if (schedule.trigger_date === currentDate) {
            if (schedule.time_on === currentTime) actionToTrigger = 'ON';
            if (schedule.time_off === currentTime) actionToTrigger = 'OFF';
          }
        } else {
          // daily
          if (schedule.time_on === currentTime) actionToTrigger = 'ON';
          if (schedule.time_off === currentTime) actionToTrigger = 'OFF';
        }

        if (actionToTrigger) {
          const device = await Device.findById(schedule.device_id);
          if (device) {
            // Trigger qua MQTT
            const feedKey = device.feed_key;
            const topic = `${process.env.AIO_USERNAME}/feeds/${feedKey}`;
            const payload = (actionToTrigger === 'ON') ? '1' : '0';
            
            mqttClient.publish(topic, payload, async (err) => {
              if (!err) {
                console.log(`[ScheduleEngine] Đã tự động kích hoạt lịch trình cho ${device.name}: ${actionToTrigger}`);
                
                // Log action
                if (systemLogRepo && systemLogRepo.createLog) {
                  await systemLogRepo.createLog({
                    event_type: 'SCHEDULE_EXECUTION',
                    description: `Hệ thống tự động kích hoạt thiết bị [${device.name}] thành [${actionToTrigger}] theo lịch trình.`,
                    device_id: device._id,
                    user_id: schedule.user_id
                  });
                }

                // Nếu là lịch 'once' và đang gửi lệnh OFF, ta đánh dấu lịch này là đã xong (is_active = false)
                if (schedule.schedule_type === 'once' && actionToTrigger === 'OFF') {
                  schedule.is_active = false;
                  await schedule.save();
                }
              } else {
                console.error(`[ScheduleEngine] Lỗi publish MQTT:`, err);
              }
            });
          }
        }
      }
    } catch (error) {
      console.error("[ScheduleEngine] Lỗi:", error);
    }
  });

  console.log("Schedule Engine đã khởi động (Hỗ trợ hẹn giờ Bật & Tắt).");
};

module.exports = startScheduleEngine;
