const { Pool } = require("pg");
require("dotenv").config();

// Khởi tạo Pool kết nối đến PostgreSQL (Hỗ trợ Neon Tech hoặc Docker Local)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

pool.on("connect", () => {
  console.log("Đã kết nối tới Cơ sở dữ liệu PostgreSQL");
});

pool.on("error", (err) => {
  console.error("Lỗi kết nối PostgreSQL:", err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
