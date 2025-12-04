const express = require("express");
const router = express.Router();
const User = require("../models/Users");

//  Fetch all users (for Admin Panel)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("firstName lastName email createdAt");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

module.exports = router;
