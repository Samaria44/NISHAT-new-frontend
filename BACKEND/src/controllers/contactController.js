const contactService = require("../services/contact.js");

// Add new message
exports.addContact = async (req, res) => {
  try {
    const savedMessage = await contactService.addMessage(req.body);
    res.status(201).json({ message: "Message sent successfully", data: savedMessage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all messages (Admin)
exports.getContacts = async (req, res) => {
  try {
    const messages = await contactService.getMessages();
    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a message (Admin)
exports.deleteContact = async (req, res) => {
  try {
    await contactService.deleteMessage(req.params.id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
