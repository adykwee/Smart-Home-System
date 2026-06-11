const express = require("express");
const userController = require("../../controllers/userController");
const { protect, adminOnly } = require("../../middlewares/auth");
const { authLimiter } = require("../../middlewares/rateLimit");

const router = express.Router();

// Public routes
router.post("/login", authLimiter, userController.login);
router.post("/register", authLimiter, userController.register);

// Protected routes (Only logged in users)
router.use(protect);

router.put("/change-password", userController.changePassword);
router.put("/update-profile", userController.updateProfile);
router.get("/", userController.getAll); // Tất cả user có thể xem danh sách thành viên

// Admin only routes
router.get("/:id", adminOnly, userController.getById);
router.post("/", adminOnly, userController.create);
router.put("/:id", adminOnly, userController.update);
router.delete("/:id", adminOnly, userController.delete);

module.exports = router;
