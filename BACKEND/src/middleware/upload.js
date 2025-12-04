// BACKEND/src/middleware/uploadSpecialSale.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Folder: /uploads/specialsale  (consistent everywhere)
const uploadsDir = path.join(__dirname, "..", "uploads", "specialsale");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const uploadSpecialSale = multer({ storage });

module.exports = uploadSpecialSale;
