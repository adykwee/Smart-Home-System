require('dotenv').config(); 
const express = require('express');
const mysql = require('mysql2');
const mqtt = require('mqtt');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); 

// ==========================================
// CONNECT TO MYSQL DATABASE
// ==========================================
// Đã thay thế bằng biến môi trường
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,      
  password: process.env.DB_PASSWORD,      
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error('Lỗi kết nối MySQL:', err);
    return;
  }
  console.log('Đã kết nối MySQL!');
});

// ==========================================
// CONNECT ADAFRUIT IO
// ==========================================
// Đã lấy Username và Key từ "két sắt" .env
const ADAFRUIT_USERNAME = process.env.ADAFRUIT_USERNAME;
const ADAFRUIT_KEY = process.env.ADAFRUIT_KEY;

const mqttClient = mqtt.connect(`mqtts://${ADAFRUIT_USERNAME}:${ADAFRUIT_KEY}@io.adafruit.com`, { port: 8883 });

mqttClient.on('connect', () => {
  console.log('Đã kết nối Adafruit IO! Chờ nhận dữ liệu...');
  // 1. Subscribe feed nhiệt độ
  mqttClient.subscribe(`${ADAFRUIT_USERNAME}/feeds/sensor-nhietdo`); 
  // 2. Subscribe các thiết bị để đồng bộ 2 chiều (Web - Adafruit - Mạch thật)
  const devicesToWatch = ['device-1', 'device-2', 'device-3', 'device-4', 'device-5'];
  devicesToWatch.forEach(key => {
    mqttClient.subscribe(`${ADAFRUIT_USERNAME}/feeds/${key}`);
  });
});

// Cập nhật dữ liệu từ Adafruit IO vào MySQL (Xử lý cả nhiệt độ và trạng thái thiết bị)
mqttClient.on('message', (topic, message) => {
  const payload = message.toString();

  // Trường hợp 1: Dữ liệu nhiệt độ
  if (topic.includes('sensor-nhietdo')) {
    const nhietDoMoi = parseFloat(payload);
    db.query("INSERT INTO Sensor_Data (device_id, temperature) VALUES (1, ?)", [nhietDoMoi]);
  } 

  // Trường hợp 2: Trạng thái thiết bị (Đồng bộ khi mạch thật thay đổi)
  else if (topic.includes('device-')) {
    const feedKey = topic.split('/').pop(); // Lấy ra 'device-1'
    const status = payload === '1' ? 'ON' : 'OFF';
    
    // Cập nhật MySQL để Web luôn hiển thị đúng trạng thái thật
    const sql = "UPDATE Devices SET current_status = ? WHERE feed_key = ?";
    db.query(sql, [status, feedKey]);
  }
});

// ==========================================
// API LẤY TRẠNG THÁI THIẾT BỊ (TỪ DATABASE THẬT)
// ==========================================
app.get('/api/devices', (req, res) => {
  const sql = "SELECT * FROM Devices";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Lỗi Database' });
    res.json(results); // Trả về danh sách có id, feed_key, current_status...
  });
});

// ==========================================
// API NHẬN LỆNH ĐIỀU KHIỂN (FIX LỖI KHÔNG LƯU DB)
// ==========================================
app.post('/api/device/control', (req, res) => {
  // Lấy dữ liệu từ React gửi qua (Khớp với Devices.jsx)
  const { id, feedKey, trangThai } = req.body; 

  const feedUrl = `${ADAFRUIT_USERNAME}/feeds/${feedKey}`;
  const giaTriGuiLen = trangThai === 'ON' ? '1' : '0';

  // 1. Gửi lệnh lên Adafruit
  mqttClient.publish(feedUrl, giaTriGuiLen, (err) => {
    if (err) return res.status(500).json({ error: 'Lỗi MQTT' });

    // 2. CẬP NHẬT VÀO DATABASE (QUAN TRỌNG NHẤT)
    const sql = "UPDATE Devices SET current_status = ? WHERE id = ?";
    db.query(sql, [trangThai, id], (dbErr, result) => {
      if (dbErr) {
        console.error('Lỗi UPDATE Database:', dbErr);
        return res.status(500).json({ error: 'Lỗi lưu Database' });
      }

      console.log(`Đã gửi lệnh [${trangThai}] và UPDATE Database cho thiết bị ID: [${id}]`);
      res.json({ success: true });
    });
  });
});

// API Lấy nhiệt độ mới nhất cho Dashboard
app.get('/api/temperature', (req, res) => {
  const sql = "SELECT temperature, recorded_at FROM Sensor_Data ORDER BY id DESC LIMIT 1";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Lỗi' });
    res.json(results[0] || { temperature: 0 });
  });
});

// Sử dụng Port từ .env, nếu không có thì mặc định chạy cổng 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Kết nối Backend thành công! Port: ${PORT}`);
});