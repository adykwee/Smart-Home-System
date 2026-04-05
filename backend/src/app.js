const express = require("express");
const cors = require("cors");

// Import các Routes chính
const routesV1 = require("./routes/v1");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Để Express hiểu được JSON body

// Mount Routes
app.use("/api/v1", routesV1);

// Xử lý route không tồn tại (404)
app.use((req, res, next) => {
  res.status(404).json({ status: "error", message: "API Endpoint không tồn tại" });
});

// Middleware xử lý lỗi tập trung
app.use(errorHandler);

module.exports = app;
