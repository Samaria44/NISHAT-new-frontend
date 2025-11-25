import Newsletter from "../models/newsletterModel.js";

export const addSubscriber = async (email) => {
  const exists = await Newsletter.findOne({ email });
  if (exists) throw new Error("Already subscribed");

  const subscriber = new Newsletter({ email });
  return await subscriber.save();
};

export const getAllSubscribers = async () => {
  return await Newsletter.find().sort({ date: -1 });
};

export const deleteSubscriber = async (id) => {
  return await Newsletter.findByIdAndDelete(id);
};
