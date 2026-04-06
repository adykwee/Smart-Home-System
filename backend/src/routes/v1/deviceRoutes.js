const express = require("express");
const deviceController = require("../../controllers/deviceController");

const router = express.Router();
router.get("/", deviceController.getAll);
router.post("/control", deviceController.controlDevice);
router.get("/:id", deviceController.getById);
router.post("/", deviceController.create);
router.put("/:id", deviceController.update);
router.delete("/:id", deviceController.delete);

module.exports = router;
