const CategoryService = require("../services/category");

exports.getCategories = async (req, res) => {
  try {
    const categories = await CategoryService.getAllCategories();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addCategory = async (req, res) => {
  try {
    const category = await CategoryService.addCategory(req.body.name);
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await CategoryService.updateCategory(
      req.params.id,
      req.body.name
    );
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await CategoryService.deleteCategory(req.params.id);
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addSubcategory = async (req, res) => {
  try {
    const category = await CategoryService.addSubcategory(req.params.id, {
      name: req.body.name,
    });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateSubcategory = async (req, res) => {
  try {
    const category = await CategoryService.updateSubcategory(
      req.params.id,
      req.params.subId,
      { name: req.body.name }
    );
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteSubcategory = async (req, res) => {
  try {
    const category = await CategoryService.deleteSubcategory(
      req.params.id,
      req.params.subId
    );
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateSubcategoryImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const category = await CategoryService.updateSubcategoryImage(
      req.params.id,
      req.params.subId,
      req.file
    );
    res.json({ message: "Image updated", category });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCategoryImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const category = await CategoryService.updateCategoryImage(
      req.params.id,
      req.file
    );
    res.json({ message: "Category image updated", category });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
