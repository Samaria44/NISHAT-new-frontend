const express = require ("express");
const {
  subscribe,
  getSubscribers,
  removeSubscriber,
} = require("../controllers/newsletterController.js");

const router = express.Router();

router.post("/", subscribe);
router.get("/", getSubscribers);
router.delete("/:id", removeSubscriber);

module.exports = router;