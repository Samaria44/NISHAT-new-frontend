const express = require("express");
const router = express.Router();
const {
  getLowStockProducts,
  getOutOfStockProducts,
  getTopSellingProducts,
  getNewArrivals,
} = require("../controllers/inventoryController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// All inventory routes are admin-only
router.get("/low-stock", [verifyToken, isAdmin], getLowStockProducts);
router.get("/out-of-stock", [verifyToken, isAdmin], getOutOfStockProducts);
router.get("/top-selling", [verifyToken, isAdmin], getTopSellingProducts);
router.get("/new-arrivals", [verifyToken, isAdmin], getNewArrivals);

module.exports = router;
