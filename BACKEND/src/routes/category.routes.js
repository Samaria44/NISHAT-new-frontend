const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/categoryController");
const multer = require("multer");
const path = require("path");

// Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // const uploadDir = req.baseUrl.includes("sub") 
    //   ? path.join(__dirname, "../uploads/subcategories")
    //   : path.join(__dirname, "../uploads/categories");
    const uploadDir = path.join(__dirname, "../uploads/categories");
    console.log("Upload directory for categories:", uploadDir);
    
    // Create directory if it doesn't exist
    if (!require("fs").existsSync(uploadDir)) {
      require("fs").mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Multer storage
const storageSub = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads/subcategories");
    console.log("Upload directory for subcategories:", uploadDir);
    
    // Create directory if it doesn't exist
    if (!require("fs").existsSync(uploadDir)) {
      require("fs").mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const uploadSub = multer({ storage: storageSub });

// Routes
router.get("/", CategoryController.getCategories);
router.post("/", CategoryController.addCategory);
router.put("/:id", CategoryController.updateCategory);
router.delete("/:id", CategoryController.deleteCategory);

router.post("/:id/sub", CategoryController.addSubcategory);
router.put("/:id/sub/:subId", CategoryController.updateSubcategory);
router.delete("/:id/sub/:subId", CategoryController.deleteSubcategory);

router.put("/:id/image", upload.single("image"), CategoryController.updateCategoryImage);
router.put("/:id/sub/:subId/image", uploadSub.single("image"), CategoryController.updateSubcategoryImage);

module.exports = router;
