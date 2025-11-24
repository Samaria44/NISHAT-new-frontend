import * as contactService from "../services/contact.js";

// Add new message
export const addContact = async (req, res) => {
  try {
    const savedMessage = await contactService.addMessage(req.body);
    res.status(201).json({ message: "Message sent successfully", data: savedMessage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all messages (Admin)
export const getContacts = async (req, res) => {
  try {
    const messages = await contactService.getMessages();
    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a message (Admin)
export const deleteContact = async (req, res) => {
  try {
    await contactService.deleteMessage(req.params.id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
