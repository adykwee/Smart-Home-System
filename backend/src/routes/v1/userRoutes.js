const express = require("express");
const userController = require("../../controllers/userController");

const router = express.Router();
<<<<<<< Updated upstream
router.get("/", userController.getAll);
router.get("/:id", userController.getById);
router.post("/", userController.create);
router.put("/:id", userController.update);
router.delete("/:id", userController.delete);
=======

// Public routes
router.post("/login", authLimiter, userController.login);
router.post("/register", authLimiter, userController.register);

// Protected routes (Only logged in users)
router.use(protect);

// Admin only routes
router.get("/", userController.getAll);
router.get("/:id", adminOnly, userController.getById);
router.post("/", adminOnly, userController.create);
router.put("/:id", adminOnly, userController.update);
router.delete("/:id", adminOnly, userController.delete);
>>>>>>> Stashed changes

module.exports = router;
