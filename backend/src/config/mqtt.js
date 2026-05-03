const mqtt = require("mqtt");
require("dotenv").config();

const ADAFRUIT_USERNAME = process.env.AIO_USERNAME;
const ADAFRUIT_KEY = process.env.AIO_KEY;
const MQTT_BROKER = `mqtts://${ADAFRUIT_USERNAME}:${ADAFRUIT_KEY}@io.adafruit.com`;

const mqttClient = mqtt.connect(MQTT_BROKER);

mqttClient.on("connect", () => {
  console.log("Đã kết nối tới Adafruit IO MQTT Broker");
  // Tự động subcribe TẤT CẢ các Feeds bằng dấu (+)
  mqttClient.subscribe(`${ADAFRUIT_USERNAME}/feeds/+`);
  console.log("Đang lắng nghe tín hiệu từ Feeds tại", `${ADAFRUIT_USERNAME}/feeds/+`);
});

mqttClient.on("error", (err) => {
  console.error("Lỗi kết nối MQTT:", err);
});

module.exports = mqttClient;
