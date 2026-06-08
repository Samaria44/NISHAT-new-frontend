const express = require("express");
const router = express.Router();
const saleTextController = require("../controllers/saletextController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// Public read
router.get("/", saleTextController.getBanner);

// Admin-only write
router.put("/", [verifyToken, isAdmin], saleTextController.updateBanner);

module.exports = router;
