import Contact from "../models/contactModel.js";

export const addMessage = async (data) => {
  const contact = new Contact(data);
  return await contact.save();
};

export const getMessages = async () => {
  return await Contact.find().sort({ date: -1 });
};

export const deleteMessage = async (id) => {
  return await Contact.findByIdAndDelete(id);
};
