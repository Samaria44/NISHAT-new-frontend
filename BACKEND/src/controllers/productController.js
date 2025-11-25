const fs = require("fs");
const path = require("path");
const Product = require("../models/productModel");

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("Get all products error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    console.error("Get product by id error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Add new product  ✅ multiple images
exports.addProduct = async (req, res) => {
  try {
    const { name, price, description, category, subCategory, size } = req.body;

    // req.files is an array (upload.array)
    const images = req.files && req.files.length > 0
      ? req.files.map((file) => `/uploads/${file.filename}`)
      : [];

    const newProduct = new Product({
      name,
      price,
      description,
      subCategory,
      category,
      size,
      images, // array of image paths
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Add product error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update product  ✅ append new images, don't lose old ones
exports.updateProduct = async (req, res) => {
  try {
    const { name, price, description, category, subCategory, size } = req.body;

    // Pehle existing product nikaalo
    const existing = await Product.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Jo basic fields update karne hain
    const updatedData = {
      name,
      price,
      description,
      category,
      subCategory,
      size,
    };

    // Agar nayi images aayi hain:
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => `/uploads/${file.filename}`);

      // ✅ OLD + NEW images
      updatedData.images = [
        ...(existing.images || []),
        ...newImages,
      ];
    } else {
      // ✅ agar new files nahi bheji, to purani images jaisi ki taisi rehne do
      updatedData.images = existing.images;
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Product not found after update" });
    }

    res.json(updated);
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get New Arrivals (latest 4 products)
exports.getNewArrivals = async (req, res) => {
  try {
    const newProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(4);
    res.json(newProducts);
  } catch (error) {
    console.error("Get new arrivals error:", error);
    res.status(500).json({ message: error.message });
  }
};
//single image delete from product
// 🔹 Single image delete (product ke images array se)
exports.deleteSingleImage = async (req, res) => {
  try {
    const { id, imageIndex } = req.params; // /products/:id/images/:imageIndex

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const idx = Number(imageIndex);
    if (isNaN(idx) || idx < 0 || idx >= product.images.length) {
      return res.status(400).json({ message: "Invalid image index" });
    }

    // jis image ko delete karna hai
    const imagePath = product.images[idx];

    // array se remove
    product.images.splice(idx, 1);
    await product.save();

    // OPTIONAL: disk se file bhi delete karni ho to
    if (imagePath) {
      // imagePath like "/uploads/123-name.jpg"
      const fullPath = path.join(__dirname, "..", imagePath); 
      fs.unlink(fullPath, (err) => {
        if (err) {
          console.error("File delete error:", err.message);
        }
      });
    }

    res.json({
      message: "Image deleted successfully",
      product,
    });
  } catch (error) {
    console.error("Delete single image error:", error);
    res.status(500).json({ message: error.message });
  }
};
