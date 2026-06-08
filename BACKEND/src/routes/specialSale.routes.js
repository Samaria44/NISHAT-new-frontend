// BACKEND/src/routes/specialSaleRoutes.js
const express = require("express");
const router = express.Router();

const uploadSpecialSale = require("../middleware/upload");
const controller = require("../controllers/specialSaleController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// Public read
router.get("/", controller.getSpecialSales);

// Admin-only write
router.post("/", [verifyToken, isAdmin], uploadSpecialSale.single("image"), controller.createSpecialSale);
router.put("/:id", [verifyToken, isAdmin], uploadSpecialSale.single("image"), controller.updateSpecialSale);
router.delete("/:id", [verifyToken, isAdmin], controller.deleteSpecialSale);

module.exports = router;
