const express = require("express");
const systemLogController = require("../../controllers/systemLogController");

const router = express.Router();
router.get("/", systemLogController.getAll);
router.get("/:id", systemLogController.getById);
router.post("/", systemLogController.create);
router.put("/:id", systemLogController.update);
router.delete("/:id", systemLogController.delete);

module.exports = router;
