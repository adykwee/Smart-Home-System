const db = require("../config/database");

const DeviceModel = {
    getAll: async () => {
        const [rows] = await db.query("SELECT * FROM devices");
        return rows;
    },
    updateStatus: async (id, status) => {
        const [result] = await db.query("UPDATE devices SET current_status = ? WHERE id = ?", [status, id]);
        return result;
    },
    updateStatusByFeed: async (feedKey, status) => {
        const [result] = await db.query("UPDATE devices SET current_status = ? WHERE feed_key = ?", [status, feedKey]);
        return result;
    }
};

module.exports = DeviceModel;
