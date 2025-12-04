// BACKEND/src/routes/specialSaleRoutes.js
const express = require("express");
const router = express.Router();

const uploadSpecialSale = require("../middleware/upload");
const controller = require("../controllers/specialSaleController");

router.get("/", controller.getSpecialSales);
router.post("/", uploadSpecialSale.single("image"), controller.createSpecialSale);
router.put("/:id", uploadSpecialSale.single("image"), controller.updateSpecialSale);
router.delete("/:id", controller.deleteSpecialSale);

module.exports = router;
