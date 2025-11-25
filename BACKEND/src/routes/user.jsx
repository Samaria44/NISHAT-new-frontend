// routes/users.js
const express = require("express");
const router = express.Router();
const db = require("../models");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// GET all users (Admin only)
router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await db.user.find({}, "-password"); // exclude password field
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
