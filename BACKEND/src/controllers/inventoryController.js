const Product = require("../models/productModel");

// Get low stock products (total batch stock > 0 and <= threshold)
exports.getLowStockProducts = async (req, res) => {
  try {
    const threshold = Number(req.query.threshold) || 5;

    // Use aggregation to compute total stock across all batches
    const products = await Product.aggregate([
      {
        $addFields: {
          totalStock: { $sum: "$batches.stock" },
        },
      },
      {
        $match: {
          totalStock: { $gt: 0, $lte: threshold },
        },
      },
      { $sort: { totalStock: 1 } },
    ]);

    res.json(products);
  } catch (err) {
    console.error("Get low-stock error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get out of stock products (total batch stock = 0)
exports.getOutOfStockProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $addFields: {
          totalStock: { $sum: "$batches.stock" },
        },
      },
      {
        $match: { totalStock: 0 },
      },
    ]);

    res.json(products);
  } catch (err) {
    console.error("Get out-of-stock error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get top selling products (by sold quantity, limit 5)
exports.getTopSellingProducts = async (req, res) => {
  try {
    const topSelling = await Product.find()
      .sort({ sold: -1 })
      .limit(5);
    res.json(topSelling);
  } catch (err) {
    console.error("Get top-selling error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get new arrivals (latest 5 products)
exports.getNewArrivals = async (req, res) => {
  try {
    const newProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5);
    res.json(newProducts);
  } catch (err) {
    console.error("Get new arrivals error:", err);
    res.status(500).json({ message: err.message });
  }
};
