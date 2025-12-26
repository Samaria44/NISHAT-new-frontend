const Newsletter = require("../models/newsletterModel.js");

const addSubscriber = async (email) => {
  const exists = await Newsletter.findOne({ email });
  if (exists) throw new Error("Already subscribed");

  const subscriber = new Newsletter({ email });
  return await subscriber.save();
};

const getAllSubscribers = async () => {
  return await Newsletter.find().sort({ date: -1 });
};

const deleteSubscriber = async (id) => {
  return await Newsletter.findByIdAndDelete(id);
};

module.exports = {
  addSubscriber,
  getAllSubscribers,
  deleteSubscriber,
};
