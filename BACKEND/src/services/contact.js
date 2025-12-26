const Contact = require("../models/contactModel.js");

const addMessage = async (data) => {
  const contact = new Contact(data);
  return await contact.save();
};

const getMessages = async () => {
  return await Contact.find().sort({ date: -1 });
};

const deleteMessage = async (id) => {
  return await Contact.findByIdAndDelete(id);
};

module.exports = {
  addMessage,
  getMessages,
  deleteMessage,
};
