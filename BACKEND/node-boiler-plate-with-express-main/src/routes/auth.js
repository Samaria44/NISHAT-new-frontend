const express = require('express');
const router = express.Router();
const { verifySignUp, authJwt } = require("../middleware");
const authController = require('../controllers/auth.controller');

router.post('/signin', authController.signin);
router.post('/signup', [verifySignUp.checkDuplicateEmail], authController.signup);
// /update-password : for user to update there password
router.post('/update-password', [authJwt.verifyToken], authController.updatePassword);
// {
//     "currentPassword": "newPassword456",
//     "newPassword": "Test@123"
// }

// for forget password first user enter email (forgotPassword) and then once verify after that (resetPassword) new password
router.post('/forgot-password', authController.forgotPassword);
// {
//     "email":"test@test.com"
// }

router.post('/reset-password', authController.resetPassword);
// {
//     "newPassword":"Test@123"
// }

module.exports = router;
