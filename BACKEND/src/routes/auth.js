//C:\Users\samar\Desktop\GCS\NISHAT-new\BACKEND\src\routes\auth.js
const express = require("express");
const router = express.Router();
const { verifySignUp, verifyToken, isAdmin, hasAnyRole } = require("../middleware");
const authController = require("../controllers/auth.controller");


// Get all users (protected route)
router.get("/", [verifyToken, isAdmin], authController.getAllUsers);

// Get current user profile
router.get("/profile", verifyToken, authController.getProfile);

// Update user profile
router.put("/profile", verifyToken, authController.updateProfile);

// Signup & Signin
router.post("/signup", [verifySignUp.checkDuplicateEmail, verifySignUp.checkRolesExisted], authController.signup);
router.post("/signin", authController.signin);

// Password
router.post("/update-password", verifyToken, authController.updatePassword);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

// Refresh Token
router.post("/refresh-token", authController.refreshToken);

// Logout
router.post("/logout", verifyToken, authController.logout);

// Moderator or Admin routes
router.get("/moderator-users", [verifyToken, hasAnyRole(["admin", "moderator"])], authController.getAllUsers);

module.exports = router;
