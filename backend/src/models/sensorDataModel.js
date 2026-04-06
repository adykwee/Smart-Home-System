const db = require("../config/database");

const SensorDataModel = {
  addTemperature: async (deviceId, temperature) => {
    const [result] = await db.query("INSERT INTO sensor_data (device_id, temperature) VALUES (?, ?)", [deviceId, temperature]);
    return result;
  },
  getLatestTemperature: async () => {
    const [rows] = await db.query("SELECT temperature, recorded_at FROM sensor_data ORDER BY id DESC LIMIT 1");
    return rows[0] || { temperature: 0 };
  }
};

module.exports = SensorDataModel;
