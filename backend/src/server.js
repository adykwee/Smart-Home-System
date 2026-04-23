require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");

const app = require("./app");
const connectDB = require("./config/database");
const mqttClient = require("./config/mqtt");
const Device = require("./models/deviceModel");
const SensorData = require("./models/sensorDataModel");
const alertEngine = require("./services/alertEngine");

connectDB();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, { cors: { origin: "*" } });

mqttClient.on("message", async (topic, message) => {
  try {
    const data = message.toString();
    const feed = topic.split("/").pop(); 
    
    // Bỏ qua nếu feed chỉ toàn là số (đây thường là ID hệ thống của Adafruit, không phải Key)
    if (/^\d+$/.test(feed)) return;

    console.log(`[MQTT RECEIVE] Topic: ${topic} | Feed: ${feed} | Data: ${data}`);

    // Tìm thiết bị trong DB theo feed_key
    let device = await Device.findOne({ feed_key: feed });
    
    // Nếu chưa có thiết bị trong DB, tự động tạo mới (Seed data)
    if (!device) {
       device = await Device.create({
         feed_key: feed,
         name: feed,
         type: feed.includes('sensor') ? 'Sensor' : 'Actuator'
       });
       console.log(`Đã tự động tạo thiết bị mới: ${feed}`);
    }

    if (device.type === 'Sensor' || feed.includes('sensor')) {
      const numericValue = parseFloat(data);
      // Lưu vào SensorData
      await SensorData.create({
        device_id: device._id,
        temperature: feed.includes('temperature') ? numericValue : undefined,
        humidity: feed.includes('humidity') ? numericValue : undefined
      });
      
      // Cập nhật giá trị mới nhất vào Device để khi load trang không bị mất
      await Device.findByIdAndUpdate(device._id, { current_status: data });

      // Kiểm tra ngưỡng
      await alertEngine.checkThresholds(device._id, feed, numericValue, io);

    } else {
      const status = data === '1' ? 'ON' : 'OFF';
      await Device.findByIdAndUpdate(device._id, { current_status: status });
    }

    // Bắn dữ liệu realtime
    io.emit("realtime_data", { feed: feed, value: data });
  } catch (error) {
    console.error("Lỗi xử lý MQTT message:", error);
  }
});

io.on("connection", (socket) => {
  console.log("Một user vừa kết nối Dashboard (Socket ID:", socket.id, ")");
  socket.on("disconnect", () => console.log("User đã ngắt kết nối"));
});

server.listen(PORT, () => {
  console.log(`Server Backend đang chạy tại http://localhost:${PORT}`);
});
