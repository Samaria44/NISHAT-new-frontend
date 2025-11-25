const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  getNewArrivals,
  deleteSingleImage,   // 🔹 yeh line add karo
} = require("../controllers/productController");

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, "../uploads")),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

// Routes
router.get("/", getAllProducts);
router.get("/new", getNewArrivals);
router.get("/:id", getProductById);

// ✅ multiple images on add + update
router.post("/", upload.array("images", 6), addProduct);
router.patch("/:id", upload.array("images", 6), updateProduct);

router.delete("/:id", deleteProduct);

// 🔹 NEW: single image delete
router.delete("/:id/images/:imageIndex", deleteSingleImage);

module.exports = router;
