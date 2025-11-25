import * as newsletterService from "../services/newsletter.js";

// Add new subscriber
export const subscribe = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    await newsletterService.addSubscriber(email);
    res.status(201).json({ message: "Subscribed successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message || "Server error" });
  }
};

// Get all subscribers (Admin)
export const getSubscribers = async (req, res) => {
  try {
    const subscribers = await newsletterService.getAllSubscribers();
    res.status(200).json(subscribers);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete subscriber (Admin)
export const removeSubscriber = async (req, res) => {
  try {
    await newsletterService.deleteSubscriber(req.params.id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
