// BACKEND/src/models/specialSaleModel.js
const mongoose = require("mongoose");

const SpecialSaleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, default: "" }, // path to uploaded image
    discount: { type: Number, default: 0 },
    navigateTo: { type: String, default: "" },

    // optional extra fields if you want to use service's logic
    active: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SpecialSale", SpecialSaleSchema);
