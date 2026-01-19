const express = require("express");
const router = express.Router();
const { verifySignUp } = require("../middleware");
const { verifyToken, isAdmin, hasAnyRole } = require("../middleware/auth");
const authController = require("../controllers/auth.controller");

// Public routes
router.post("/signup", [verifySignUp.checkDuplicateEmail, verifySignUp.checkRolesExisted], authController.signup);
router.post("/signin", authController.signin);
router.post("/refresh-token", authController.refreshToken);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

// Protected routes (require valid token)
router.get("/profile", verifyToken, authController.getProfile);
router.put("/profile", verifyToken, authController.updateProfile);
router.post("/update-password", verifyToken, authController.updatePassword);
router.post("/logout", verifyToken, authController.logout);

// Admin only routes
router.get("/users", [verifyToken, isAdmin], authController.getAllUsers);

// Moderator or Admin routes
router.get("/moderator-users", [verifyToken, hasAnyRole(["admin", "moderator"])], authController.getAllUsers);

module.exports = router;
