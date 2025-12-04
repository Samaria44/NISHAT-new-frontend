const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema({
  batchName: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    category: String,
    subCategory: String,
    

    // Sizes for the product (multi-select)
    generalSizes: [{ type: String }],

    images: [String],
    batches: [batchSchema],
    sold: { type: Number, default: 0 }, // optional, for top-selling
  },
  { timestamps: true }
);

module.exports = mongoose.model("product", productSchema);
