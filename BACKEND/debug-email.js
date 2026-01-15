require("dotenv").config();

console.log("=== Email Configuration Debug ===");
console.log("EMAIL_USER exists:", !!process.env.EMAIL_USER);
console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);
console.log("EMAIL_USER value:", process.env.EMAIL_USER ? process.env.EMAIL_USER.substring(0, 5) + "***" : "undefined");
console.log("EMAIL_PASS value:", process.env.EMAIL_PASS ? "***SET***" : "undefined");

// Test nodemailer without sending email
const nodemailer = require("nodemailer");

try {
  const transporter = nodemailer.createTransporter({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  console.log("✅ Transporter created successfully");
} catch (error) {
  console.error("❌ Transporter creation failed:", error.message);
}
