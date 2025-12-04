const mongoose = require("mongoose");

const SubcategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, default: "" },
});

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, default: "" },
  subcategories: [SubcategorySchema],
});

module.exports = mongoose.model("Category", CategorySchema);
