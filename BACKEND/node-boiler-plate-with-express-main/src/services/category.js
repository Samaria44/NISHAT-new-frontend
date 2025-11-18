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

exports.addSubcategory = async (categoryId, { name }) => {
  const category = await Category.findById(categoryId);
  if (!category) throw new Error("Category not found");
  category.subcategories.push({ name });
  return await category.save();
};

exports.updateSubcategory = async (categoryId, subId, { name }) => {
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

  // Delete image file if exists
  if (sub.image) {
    const filePath = path.join(__dirname, "../uploads", sub.image);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  sub.remove();
  return await category.save();
};

exports.updateSubcategoryImage = async (categoryId, subId, file) => {
  const category = await Category.findById(categoryId);
  if (!category) throw new Error("Category not found");
  const sub = category.subcategories.id(subId);
  if (!sub) throw new Error("Subcategory not found");

  // Delete old image if exists
  if (sub.image) {
    const oldPath = path.join(__dirname, "../uploads", sub.image);
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
  }

  // Save new image path
  sub.image = `/subcategories/${file.filename}`;
  return await category.save();
};
