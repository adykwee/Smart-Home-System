const express = require("express");
const router = express.Router();
const deviceController = require("../../controllers/deviceController");

// Khai báo Endpoint: POST /api/v1/devices/control
router.post("/control", deviceController.controlDevice);

module.exports = router;
