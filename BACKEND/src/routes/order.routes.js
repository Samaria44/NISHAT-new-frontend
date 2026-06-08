// routes/orderRoutes.js
const express = require("express");
const {
  getAllOrders,
  getOrderById,
  addOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Admin-only routes
router.get("/", [verifyToken, isAdmin], getAllOrders);
router.get("/:id", [verifyToken, isAdmin], getOrderById);
router.patch("/:id", [verifyToken, isAdmin], updateOrder);
router.delete("/:id", [verifyToken, isAdmin], deleteOrder);

// Public — customers place orders
router.post("/", addOrder);

module.exports = router;
