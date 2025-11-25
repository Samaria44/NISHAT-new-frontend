const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/categoryController");
const multer = require("multer");
const path = require("path");

// Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/subcategories"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Routes
router.get("/", CategoryController.getCategories);
router.post("/", CategoryController.addCategory);
router.put("/:id", CategoryController.updateCategory);
router.delete("/:id", CategoryController.deleteCategory);

router.post("/:id/sub", CategoryController.addSubcategory);
router.put("/:id/sub/:subId", CategoryController.updateSubcategory);
router.delete("/:id/sub/:subId", CategoryController.deleteSubcategory);

router.put("/:id/sub/:subId/image", upload.single("image"), CategoryController.updateSubcategoryImage);

module.exports = router;
