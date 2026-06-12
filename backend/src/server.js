require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");

const app = require("./app");
const connectDB = require("./config/database"); // Kích hoạt kết nối DB
connectDB();
const mqttClient = require("./config/mqtt"); // Kích hoạt MQTT
const Device = require("./models/deviceModel");
const SensorData = require("./models/sensorDataModel");
const User = require("./models/userModel");

// Khởi tạo tài khoản admin mặc định
const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      await User.create({ username: 'admin', password: 'password123', role: 'admin' });
      console.log('Đã tạo tài khoản admin mặc định (admin / password123)');
    }
  } catch (error) {
    console.error('Lỗi khi tạo admin mặc định:', error);
  }
};
seedAdmin();

const PORT = process.env.PORT || 5000;

// Khởi tạo HTTP Server từ Express App
const server = http.createServer(app);

// Khởi tạo Socket.IO
const io = new Server(server, { cors: { origin: "*" } });
app.set("io", io); // Cho phép các controller truy cập io

const alertEngine = require("./services/alertEngine");
const startScheduleEngine = require("./services/scheduleEngine");
const deviceRepo = require("./repositories/DeviceRepository");
const systemLogRepo = require("./repositories/SystemLogRepository");
const DeviceFactory = require("./factories/DeviceFactory");

// Lắng nghe dữ liệu real-time từ MQTT để bắn sang Web qua Socket.IO
mqttClient.on("message", async (topic, message) => {
  try {
    const data = message.toString();
    const feed = topic.split("/").pop();

    // Bỏ qua nếu feed chỉ toàn là số
    if (/^\d+$/.test(feed)) return;

    console.log(`[MQTT RECEIVE] Topic: ${topic} | Feed: ${feed} | Data: ${data}`);

    // Tìm thiết bị trong DB theo feed_key (Repository Pattern)
    let device = await deviceRepo.findByFeedKey(feed);

    // Nếu chưa có thiết bị trong DB, tự động tạo mới (Factory Pattern)
    if (!device) {
      const newDeviceData = DeviceFactory.createDevice(feed);
      device = await deviceRepo.createDevice(newDeviceData);
      console.log(`Đã tự động tạo thiết bị mới từ Factory: ${device.name}`);
    }

    if (device.type === 'Sensor') {
      const numericValue = parseFloat(data);
      // Lưu vào SensorData
      await SensorData.create({
        device_id: device._id,
        temperature: feed.includes('temp') ? numericValue : undefined,
        humidity: feed.includes('humid') ? numericValue : undefined,
        light: (feed.includes('light') || feed.includes('lux')) ? numericValue : undefined
      });

      // Sensors lưu giá trị số vào current_status (không đổi ON/OFF)
      await deviceRepo.updateStatus(device._id, data);

      // Tự động kích hoạt thông báo khi phát hiện chuyển động (kể cả không cấu hình ngưỡng)
      const isMotionSensor = feed.toLowerCase().includes('motion') || 
                             (device.name && device.name.toLowerCase().includes('chuyển động'));
      if (isMotionSensor && (data === '1' || data.toLowerCase() === 'active' || data.toLowerCase() === 'true')) {
        const msg = `[Cảnh báo] Phát hiện chuyển động tại khu vực [${device.room || 'Chưa gán phòng'}]`;
        
        io.emit('alert', {
          device_id: device._id,
          feed: feed,
          message: msg,
          room: device.room || 'Chưa gán phòng',
          type: 'motion',
          timestamp: new Date()
        });

        await systemLogRepo.createLog({
          event_type: 'MOTION_ALERT',
          description: msg,
          device_id: device._id
        });
      }

      // Kiểm tra ngưỡng khác (Strategy Pattern)
      if (!isMotionSensor) {
        await alertEngine.checkThresholds(device._id, feed, numericValue, io);
      }

    } else {
      const isFan = device.name?.toLowerCase().includes('fan') || 
                    device.name?.toLowerCase().includes('quạt') || 
                    device.name?.toLowerCase().includes('quat') || 
                    device.feed_key?.toLowerCase().includes('fan');
      let status;
      if (isFan) {
        if (data.toUpperCase() === 'ON') {
          status = '50';
        } else if (data.toUpperCase() === 'OFF') {
          status = '0';
        } else {
          const speedNum = Number(data);
          if (!isNaN(speedNum) && speedNum >= 0 && speedNum <= 100) {
            status = data;
          } else {
            status = '0';
          }
        }
      } else {
        // Actuator (đèn, thiết bị khác): chuyển sang ON/OFF
        status = (data === '1' || data.toUpperCase() === 'ON') ? 'ON' : 'OFF';
      }
      await deviceRepo.updateStatus(device._id, status);
    }

    // Bắn dữ liệu cho tất cả Client đang mở Web
    io.emit("realtime_data", { feed: feed, value: data });
  } catch (error) {
    console.error("Lỗi xử lý MQTT message:", error);
  }
});

io.on("connection", (socket) => {
  console.log("Một user vừa kết nối Dashboard (Socket ID:", socket.id, ")");
  socket.on("disconnect", () => console.log("User đã ngắt kết nối"));
});

// Khởi động Schedule Engine
startScheduleEngine(io);

// Chạy Server
server.listen(PORT, () => {
  console.log(`Server Backend đang chạy tại http://localhost:${PORT}`);
});
