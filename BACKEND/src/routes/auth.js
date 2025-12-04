//C:\Users\samar\Desktop\GCS\NISHAT-new\BACKEND\src\routes\auth.js
const express = require("express");
const router = express.Router();
const { verifySignUp, authJwt } = require("../middleware");
const authController = require("../controllers/auth.controller");


// Get all users (protected route)
router.get("/", authJwt.verifyToken, authController.getAllUsers);

// Signup & Signin
router.post("/signup", [verifySignUp.checkDuplicateEmail, verifySignUp.checkRolesExisted], authController.signup);
router.post("/signin", authController.signin);

// Password
router.post("/update-password", authJwt.verifyToken, authController.updatePassword);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

// Refresh Token
router.post("/refresh-token", authController.refreshToken);

module.exports = router;
