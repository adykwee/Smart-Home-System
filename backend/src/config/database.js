const mysql = require("mysql2/promise");
require("dotenv").config();

// Khởi tạo Pool kết nối đến MySQL (XAMPP mặc định)
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "smart_home_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection()
  .then((conn) => {
    console.log("Đã kết nối tới Cơ sở dữ liệu MySQL");
    conn.release();
  })
  .catch((err) => {
    console.error("Lỗi kết nối MySQL:", err);
  });

module.exports = pool;
