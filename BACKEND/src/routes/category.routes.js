const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/categoryController");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// Multer storage for category images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads/categories");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Multer storage for subcategory images
const storageSub = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads/subcategories");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const uploadSub = multer({ storage: storageSub });

// Public read
router.get("/", CategoryController.getCategories);

// Admin-only write
router.post("/", [verifyToken, isAdmin], CategoryController.addCategory);
router.put("/:id", [verifyToken, isAdmin], CategoryController.updateCategory);
router.delete("/:id", [verifyToken, isAdmin], CategoryController.deleteCategory);

router.post("/:id/sub", [verifyToken, isAdmin], CategoryController.addSubcategory);
router.put("/:id/sub/:subId", [verifyToken, isAdmin], CategoryController.updateSubcategory);
router.delete("/:id/sub/:subId", [verifyToken, isAdmin], CategoryController.deleteSubcategory);

router.put("/:id/image", [verifyToken, isAdmin], upload.single("image"), CategoryController.updateCategoryImage);
router.put("/:id/sub/:subId/image", [verifyToken, isAdmin], uploadSub.single("image"), CategoryController.updateSubcategoryImage);

module.exports = router;
