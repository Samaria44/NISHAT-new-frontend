const express =require ("express");
const { addContact, getContacts, deleteContact }
 = require("../controllers/contactController.js");

const router = express.Router();

router.post("/", addContact);           // Submit form
router.get("/", getContacts);           // Admin view all messages
router.delete("/:id", deleteContact);   // Admin delete

module.exports = router;
