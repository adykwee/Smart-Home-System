const mqtt = require("mqtt");
require("dotenv").config();

const ADAFRUIT_USERNAME = process.env.AIO_USERNAME ? process.env.AIO_USERNAME.trim() : "";
const ADAFRUIT_KEY = process.env.AIO_KEY ? process.env.AIO_KEY.trim() : "";

console.log(`[MQTT] Đang kết nối với username: [${ADAFRUIT_USERNAME}] (độ dài: ${ADAFRUIT_USERNAME.length})`);

const mqttClient = mqtt.connect("mqtts://io.adafruit.com", {
  username: ADAFRUIT_USERNAME,
  password: ADAFRUIT_KEY,
  port: 8883
});

mqttClient.on("connect", () => {
  console.log("Đã kết nối tới Adafruit IO MQTT Broker thành công!");
  mqttClient.subscribe(`${ADAFRUIT_USERNAME}/feeds/+`);
  console.log("Đang lắng nghe tín hiệu từ Feeds tại:", `${ADAFRUIT_USERNAME}/feeds/+`);
});

mqttClient.on("error", (err) => {
  console.error("Lỗi kết nối MQTT:", err.message || err);
});

module.exports = mqttClient;
