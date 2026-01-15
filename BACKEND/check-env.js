require("dotenv").config();

console.log("=== Email Configuration Debug ===");
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);
console.log("EMAIL_PASS length:", process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0);

if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  console.log("✅ Email configuration appears complete");
  console.log("EMAIL_PASS format check:", process.env.EMAIL_PASS.includes(" ") ? "HAS SPACES - REMOVE THEM" : "FORMAT OK");
} else {
  console.log("❌ Email configuration incomplete");
}
