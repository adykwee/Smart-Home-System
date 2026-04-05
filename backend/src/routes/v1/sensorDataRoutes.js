const express = require("express");
const sensorDataController = require("../../controllers/sensorDataController");

const router = express.Router();
router.get("/", sensorDataController.getAll);
router.get("/:id", sensorDataController.getById);
router.post("/", sensorDataController.create);
router.put("/:id", sensorDataController.update);
router.delete("/:id", sensorDataController.delete);

module.exports = router;
