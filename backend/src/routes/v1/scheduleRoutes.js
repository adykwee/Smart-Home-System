const express = require("express");
const scheduleController = require("../../controllers/scheduleController");

const router = express.Router();
router.get("/", scheduleController.getAll);
router.get("/:id", scheduleController.getById);
router.post("/", scheduleController.create);
router.put("/:id", scheduleController.update);
router.delete("/:id", scheduleController.delete);

module.exports = router;
