const Category = require("../models/categoryModel");
const path = require("path");
const fs = require("fs");

exports.getAllCategories = async () => {
  return await Category.find();
};

exports.addCategory = async (name) => {
  const category = new Category({ name });
  return await category.save();
};

exports.updateCategory = async (id, name) => {
  return await Category.findByIdAndUpdate(id, { name }, { new: true });
};

exports.deleteCategory = async (id) => {
  return await Category.findByIdAndDelete(id);
};


// ----------------------
//  Subcategory
// ----------------------
exports.addSubcategory = async (categoryId, { name }) => {
  if (!name) throw new Error("Subcategory name is required");

  const category = await Category.findById(categoryId);
  if (!category) throw new Error("Category not found");

  category.subcategories.push({ name });
  return await category.save();
};


exports.updateSubcategory = async (categoryId, subId, { name }) => {
  if (!name) throw new Error("Subcategory name is required");

  const category = await Category.findById(categoryId);
  if (!category) throw new Error("Category not found");

  const sub = category.subcategories.id(subId);
  if (!sub) throw new Error("Subcategory not found");

  sub.name = name;
  return await category.save();
};


exports.deleteSubcategory = async (categoryId, subId) => {
  const category = await Category.findById(categoryId);
  if (!category) throw new Error("Category not found");

  const sub = category.subcategories.id(subId);
  if (!sub) throw new Error("Subcategory not found");


  if (sub.image) {
    const filePath = path.join(__dirname, "../uploads", sub.image);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  category.subcategories.pull(subId);

  return await category.save();
};



exports.updateSubcategoryImage = async (categoryId, subId, file) => {
  if (!file) throw new Error("No file uploaded");

  const category = await Category.findById(categoryId);
  if (!category) throw new Error("Category not found");

  const sub = category.subcategories.id(subId);
  if (!sub) throw new Error("Subcategory not found");

  // Ensure uploads directory exists
  const uploadDir = path.join(__dirname, "..", "uploads", "subcategories");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Delete old image if exists
  if (sub.image) {
    const oldPath = path.join(__dirname, "..", "uploads", "subcategories", path.basename(sub.image));
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
  }

  // Save new image in /uploads/subcategories
  sub.image = `/uploads/subcategories/${file.filename}`;

  return await category.save();
};

exports.updateCategoryImage = async (categoryId, file) => {
  if (!file) throw new Error("No file uploaded");

  const category = await Category.findById(categoryId);
  if (!category) throw new Error("Category not found");

  // Ensure uploads directory exists
  const uploadDir = path.join(__dirname, "..", "uploads", "categories");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Delete old image if exists
  if (category.image) {
    const oldPath = path.join(__dirname, "..", "uploads", "categories", path.basename(category.image));
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
  }

  // Save new image
  category.image = `/uploads/categories/${file.filename}`;

  return await category.save();
};
