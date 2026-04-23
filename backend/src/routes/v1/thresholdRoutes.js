const express = require("express");
const thresholdController = require("../../controllers/thresholdController");

const router = express.Router();
router.get("/", thresholdController.getAll);
router.get("/type/:type", thresholdController.getByMetricType);
router.get("/:id", thresholdController.getById);
router.post("/", thresholdController.create);
router.post("/upsert", thresholdController.upsertThreshold);
router.put("/:id", thresholdController.update);
router.delete("/:id", thresholdController.delete);

module.exports = router;
