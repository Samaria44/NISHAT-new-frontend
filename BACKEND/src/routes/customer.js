const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customer");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// All customer management routes are admin-only
router.post(
  "/",
  [verifyToken, isAdmin],
  customerController.upload.single("profilePicture"),
  customerController.createCustomer
);
router.get("/", [verifyToken, isAdmin], customerController.getCustomers);
router.put("/:id", [verifyToken, isAdmin], customerController.updateCustomer);
router.delete("/:id", [verifyToken, isAdmin], customerController.deleteCustomer);

module.exports = router;
