const express = require("express");
const router = express.Router();
const {
  getLowStockProducts,
  getOutOfStockProducts,
  getTopSellingProducts,
  getNewArrivals,
} = require("../controllers/inventoryController");

// Low stock
router.get("/low-stock", getLowStockProducts);

// Out of stock
router.get("/out-of-stock", getOutOfStockProducts);

// Top selling
router.get("/top-selling", getTopSellingProducts);

// New arrivals
router.get("/new-arrivals", getNewArrivals);

module.exports = router;
