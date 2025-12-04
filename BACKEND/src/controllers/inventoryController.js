const Product = require("../models/productModel");

// ✅ Get low stock products (stock <= 5)
exports.getLowStockProducts = async (req, res) => {
  try {
    const lowStock = await Product.find({ stock: { $lte: 5, $gt: 0 } }).sort({
      stock: 1,
    });
    res.json(lowStock);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get out of stock products (stock = 0)
exports.getOutOfStockProducts = async (req, res) => {
  try {
    const outOfStock = await Product.find({ stock: 0 });
    res.json(outOfStock);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get top selling products (by sold quantity, limit 5)
exports.getTopSellingProducts = async (req, res) => {
  try {
    const topSelling = await Product.find()
      .sort({ sold: -1 })
      .limit(5);
    res.json(topSelling);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get new arrivals (latest 5 products)
exports.getNewArrivals = async (req, res) => {
  try {
    const newProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5);
    res.json(newProducts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
