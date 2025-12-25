const express = require("express");
const router = express.Router();
const saleTextController = require("../controllers/saletextController");

// GET banner - this will be accessible at /specialsale/banner
router.get("/", saleTextController.getBanner);

// UPDATE banner - this will be accessible at /specialsale/banner
router.put("/", saleTextController.updateBanner);

module.exports = router;
