const db = require("../config/database");

const LogModel = {
  // Lưu lịch sử hoạt động vào bảng System_logs
  insertLog: async (deviceId, action, status) => {
    const query = `
            INSERT INTO system_logs (device_id, action, status, created_at) 
            VALUES ($1, $2, $3, NOW()) RETURNING *;
        `;
    const values = [deviceId, action, status];
    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Lỗi insert DB:", error);
      throw error;
    }
  },
};

module.exports = LogModel;
