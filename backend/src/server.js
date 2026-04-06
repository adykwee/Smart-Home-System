require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");

const app = require("./app");
require("./config/database"); // Kích hoạt kết nối DB
const mqttClient = require("./config/mqtt"); // Kích hoạt MQTT
const DeviceModel = require("./models/deviceModel");
const SensorDataModel = require("./models/sensorDataModel");

const PORT = process.env.PORT || 5000;

// Khởi tạo HTTP Server từ Express App
const server = http.createServer(app);

// Khởi tạo Socket.IO
const io = new Server(server, { cors: { origin: "*" } });

// Lắng nghe dữ liệu real-time từ MQTT để bắn sang Web qua Socket.IO
mqttClient.on("message", (topic, message) => {
  const data = message.toString();
  const feed = topic.split("/").pop(); // Lấy tên feed từ topic (vd: nhiet-do)

  // Lưu vào DB
  if (feed === "temperature-sensor") {
    SensorDataModel.addTemperature(1, parseFloat(data)).catch((err) => console.error("Lỗi sensor_data:", err));
  } else if (feed === "fan") {
    const status = data === '1' ? 'ON' : 'OFF';
    DeviceModel.updateStatusByFeed(feed, status).catch((err) => console.error("Lỗi devices:", err));
  }

  // Bắn dữ liệu cho tất cả Client đang mở Web
  io.emit("realtime_data", { feed: feed, value: data });
});

io.on("connection", (socket) => {
  console.log("Một user vừa kết nối Dashboard (Socket ID:", socket.id, ")");
  socket.on("disconnect", () => console.log("User đã ngắt kết nối"));
});

// Chạy Server
server.listen(PORT, () => {
  console.log(`Server Backend đang chạy tại http://localhost:${PORT}`);
});
