const express = require("express");
const {
  subscribe,
  getSubscribers,
  removeSubscriber,
} = require("../controllers/newsletterController.js");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Public — anyone can subscribe
router.post("/", subscribe);

// Admin only
router.get("/", [verifyToken, isAdmin], getSubscribers);
router.delete("/:id", [verifyToken, isAdmin], removeSubscriber);

module.exports = router;
