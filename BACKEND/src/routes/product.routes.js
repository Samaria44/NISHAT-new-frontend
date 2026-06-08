const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  deleteSingleImage,
  getNewArrivals,
  getOutOfStock,
  getLowStock,
  getTopSelling,
} = require("../controllers/productController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Multer setup — ensure upload dir exists
const UPLOAD_DIR = path.join(__dirname, "../uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Public read routes
router.get("/", getAllProducts);
router.get("/new", getNewArrivals);
router.get("/out-of-stock", getOutOfStock);
router.get("/low-stock", getLowStock);
router.get("/top-selling", getTopSelling);
router.get("/:id", getProductById);

// Admin-only write routes
router.post("/", [verifyToken, isAdmin], upload.array("images", 8), addProduct);
router.patch("/:id", [verifyToken, isAdmin], upload.array("images", 8), updateProduct);
router.delete("/:id", [verifyToken, isAdmin], deleteProduct);
router.delete("/:id/images/:imageIndex", [verifyToken, isAdmin], deleteSingleImage);

module.exports = router;
