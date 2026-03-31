const express = require("express");
const cors = require("cors");

// Import các Routes
const deviceRoutes = require("./routes/v1/deviceRoutes");
// const sensorRoutes = require('./routes/v1/sensorRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Để Express hiểu được JSON body

// Mount Routes
app.use("/api/v1/devices", deviceRoutes);
// app.use('/api/v1/sensors', sensorRoutes);

// Xử lý route không tồn tại (404)
app.use((req, res) => {
  res.status(404).json({ message: "API Endpoint không tồn tại" });
});

module.exports = app;
