const express = require("express");
const userRoutes = require("./userRoutes");
const deviceRoutes = require("./deviceRoutes");
const sensorDataRoutes = require("./sensorDataRoutes");
const systemLogRoutes = require("./systemLogRoutes");
const scheduleRoutes = require("./scheduleRoutes");
const thresholdRoutes = require("./thresholdRoutes");
const { protect } = require("../../middlewares/auth");

const router = express.Router();

// Public & partially protected route
router.use("/users", userRoutes);

// Fully protected routes
router.use(protect);
router.use("/devices", deviceRoutes);
router.use("/sensor-data", sensorDataRoutes);
router.use("/system-logs", systemLogRoutes);
router.use("/schedules", scheduleRoutes);
router.use("/thresholds", thresholdRoutes);

module.exports = router;
