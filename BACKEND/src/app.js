const express = require("express");
require("dotenv").config();

const cors = require("cors");
const path = require("path");

const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
const categoryRoutes = require("./routes/category.routes");
const newsletterRoutes = require("./routes/newsletter.routes.js");
const contactRoutes = require("./routes/contact.routes.js");
const authRoutes = require("./routes/auth");
const specialSaleRoutes = require("./routes/specialSale.routes");
const carouselRoutes = require("./routes/carousel.routes.js");
const saletextRoutes = require("./routes/saletext.routes.js");
const inventoryRoutes = require("./routes/inventory.routes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/categories", categoryRoutes);
app.use("/newsletter", newsletterRoutes);
app.use("/contact", contactRoutes);
app.use("/auth", authRoutes);
// Use lowercase "/admin" — consistent and works on Linux/Vercel
app.use("/admin", adminRoutes);
app.use("/specialsale/banner", saletextRoutes);
app.use("/specialsale", specialSaleRoutes);
app.use("/carousel", carouselRoutes);
app.use("/inventory", inventoryRoutes);

// Global error handler — returns JSON instead of HTML for API clients
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

module.exports = app;
