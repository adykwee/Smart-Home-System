const mongoose = require('mongoose');
require("dotenv").config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Đã kết nối tới MongoDB: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Lỗi kết nối MongoDB: ${err.message}`);
    process.exit(1);
  }
};

// Export the function to be called in server.js
module.exports = connectDB;
