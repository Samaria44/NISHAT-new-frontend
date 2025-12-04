// NISHAT-new/BACKEND/src/routes/carousel.routes.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const CarouselController = require("../controllers/carouselController");

const router = express.Router();

// Multer configuration for carousel images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // uploads/carousel ko BACKEND root ke andar banayenge
    const uploadPath = path.join(__dirname,  "../uploads/carousel");

    // Agar folder exist nahi karta to bana do
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

// Routes
router.get("/", CarouselController.getAllCarousel);
router.get("/active", CarouselController.getActiveCarousel);
router.post("/", CarouselController.createCarousel);
router.put("/:id", CarouselController.updateCarousel);
router.delete("/:id", CarouselController.deleteCarousel);
router.put(
  "/:id/image",
  upload.single("image"),
  CarouselController.updateCarouselImage
);

module.exports = router;
