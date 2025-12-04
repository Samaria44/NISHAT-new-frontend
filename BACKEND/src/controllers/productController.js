const fs = require("fs");
const path = require("path");
const Product = require("../models/productModel");

// ===================== Get all products =====================
exports.getAllProducts = async (req, res) => {
  try {
    const { query, category, subCategory } = req.query;
    const filter = {};

    if (query) filter.name = { $regex: query.trim(), $options: "i" };
    if (category) filter.category = { $regex: `^${category.trim()}$`, $options: "i" };
    if (subCategory)
      filter.subCategory = { $regex: `^${subCategory.trim()}$`, $options: "i" };

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error("Get all products error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ===================== Get product by ID =====================
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

// ===================== Add new product =====================
exports.addProduct = async (req, res) => {
  try {
    const { name, description, category, subCategory, size, batches } = req.body;

    // Upload images
    const images =
      req.files && req.files.length > 0
        ? req.files.map((file) => `/uploads/${file.filename}`)
        : [];

    // Parse generalSizes
    let generalSizesParsed = [];
    if (size) {
      if (Array.isArray(size)) generalSizesParsed = size;
      else {
        try {
          generalSizesParsed = JSON.parse(size);
        } catch {
          generalSizesParsed = size.split(",").map((s) => s.trim());
        }
      }
    }

    // Parse batches
    const batchData = batches ? JSON.parse(batches) : [];

    const newProduct = new Product({
      name,
      description,
      category,
      subCategory,
      generalSizes: generalSizesParsed,
      images,
      batches: batchData,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Add product error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ===================== Update product =====================
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, category, subCategory, size, batches } = req.body;

    const existing = await Product.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Product not found" });

    const updatedData = { name, description, category, subCategory };

    // generalSizes
    if (size) {
      if (Array.isArray(size)) updatedData.generalSizes = size;
      else {
        try {
          updatedData.generalSizes = JSON.parse(size);
        } catch {
          updatedData.generalSizes = size.split(",").map((s) => s.trim());
        }
      }
    } else {
      updatedData.generalSizes = existing.generalSizes;
    }

    // Images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => `/uploads/${file.filename}`);
      updatedData.images = [...(existing.images || []), ...newImages];
    } else {
      updatedData.images = existing.images;
    }

    // Batches
    if (batches) updatedData.batches = JSON.parse(batches);
    else updatedData.batches = existing.batches;

    const updated = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.json(updated);
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ===================== Delete product =====================
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

// ===================== Delete single image =====================
exports.deleteSingleImage = async (req, res) => {
  try {
    const { id, imageIndex } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const idx = Number(imageIndex);
    if (isNaN(idx) || idx < 0 || idx >= product.images.length)
      return res.status(400).json({ message: "Invalid image index" });

    const imagePath = product.images[idx];
    product.images.splice(idx, 1);
    await product.save();

    // Delete from filesystem
    if (imagePath) {
      const fullPath = path.join(__dirname, "..", imagePath);
      fs.unlink(fullPath, (err) => {
        if (err) console.error("File delete error:", err.message);
      });
    }

    res.json({ message: "Image deleted successfully", product });
  } catch (error) {
    console.error("Delete single image error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ===================== New Arrivals =====================
exports.getNewArrivals = async (req, res) => {
  try {
    const newProducts = await Product.find().sort({ createdAt: -1 }).limit(4);
    res.json(newProducts);
  } catch (error) {
    console.error("Get new arrivals error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ===================== Out of Stock =====================
exports.getOutOfStock = async (req, res) => {
  try {
    const products = await Product.find();
    const outOfStock = products.filter(
      (p) => (p.batches || []).reduce((sum, b) => sum + (Number(b.stock) || 0), 0) === 0
    );
    res.json(outOfStock);
  } catch (err) {
    console.error("Get out-of-stock error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ===================== Low Stock =====================
exports.getLowStock = async (req, res) => {
  try {
    const threshold = Number(req.query.threshold) || 5;
    const products = await Product.find();
    const lowStock = products.filter((p) => {
      const totalStock = (p.batches || []).reduce((sum, b) => sum + (Number(b.stock) || 0), 0);
      return totalStock > 0 && totalStock <= threshold;
    });
    res.json(lowStock);
  } catch (err) {
    console.error("Get low-stock error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ===================== Top Selling =====================
exports.getTopSelling = async (req, res) => {
  try {
    const products = await Product.find();
    const sorted = products.sort((a, b) => (b.sold || 0) - (a.sold || 0));
    res.json(sorted.slice(0, 5));
  } catch (err) {
    console.error("Get top-selling error:", err);
    res.status(500).json({ message: err.message });
  }
};
