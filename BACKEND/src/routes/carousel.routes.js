// NISHAT-new/BACKEND/src/routes/carousel.routes.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const CarouselController = require("../controllers/carouselController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Multer configuration for carousel images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/carousel");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Public read routes
router.get("/", CarouselController.getAllCarousel);
router.get("/active", CarouselController.getActiveCarousel);

// Admin-only write routes
router.post("/", [verifyToken, isAdmin], CarouselController.createCarousel);
router.put("/:id", [verifyToken, isAdmin], CarouselController.updateCarousel);
router.delete("/:id", [verifyToken, isAdmin], CarouselController.deleteCarousel);
router.put(
  "/:id/image",
  [verifyToken, isAdmin],
  upload.single("image"),
  CarouselController.updateCarouselImage
);

module.exports = router;
