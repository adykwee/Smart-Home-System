const express = require("express");
const userRoutes = require("./userRoutes");
const deviceRoutes = require("./deviceRoutes");
const sensorDataRoutes = require("./sensorDataRoutes");
const systemLogRoutes = require("./systemLogRoutes");
const scheduleRoutes = require("./scheduleRoutes");
const thresholdRoutes = require("./thresholdRoutes");

const router = express.Router();

// Định tuyến dựa trên cấu trúc CSDL SQL
router.use("/users", userRoutes);
router.use("/devices", deviceRoutes);
router.use("/sensor-data", sensorDataRoutes);
router.use("/system-logs", systemLogRoutes);
router.use("/schedules", scheduleRoutes);
router.use("/thresholds", thresholdRoutes);

module.exports = router;
