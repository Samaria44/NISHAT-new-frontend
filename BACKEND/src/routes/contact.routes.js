const express = require("express");
const { addContact, getContacts, deleteContact } = require("../controllers/contactController.js");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Public — anyone can submit the contact form
router.post("/", addContact);

// Admin only
router.get("/", [verifyToken, isAdmin], getContacts);
router.delete("/:id", [verifyToken, isAdmin], deleteContact);

module.exports = router;
