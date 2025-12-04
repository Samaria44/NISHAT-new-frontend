// NISHAT-new/BACKEND/src/models/carouselModel.js
const mongoose = require("mongoose");

const CarouselSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: null,
    },
    path: {
      type: String,
      default: "/",
    },
    active: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Carousel = mongoose.model("Carousel", CarouselSchema);

module.exports = Carousel;
