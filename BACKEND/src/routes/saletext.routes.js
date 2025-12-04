const express = require("express");
const router = express.Router();
const saleTextController = require("../controllers/saletextController");

// GET banner
router.get("/banner", saleTextController.getBanner);

// UPDATE banner
router.put("/banner", saleTextController.updateBanner);

module.exports = router;
