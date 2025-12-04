const express = require("express");
const multer = require("multer");
const path = require("path");
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

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads")),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// CRUD routes
router.get("/", getAllProducts);
router.get("/new", getNewArrivals);
router.get("/out-of-stock", getOutOfStock);
router.get("/low-stock", getLowStock);
router.get("/top-selling", getTopSelling);

router.get("/:id", getProductById);

router.post("/", upload.array("images", 8), addProduct);
router.patch("/:id", upload.array("images", 8), updateProduct);
router.delete("/:id", deleteProduct);

// Single image delete
router.delete("/:id/images/:imageIndex", deleteSingleImage);

module.exports = router;
