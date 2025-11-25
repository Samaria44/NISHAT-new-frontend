const express = require("express");


const cors = require("cors");
const path = require("path");

const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
const categoryRoutes = require("./routes/category.routes");
const newsletterRoutes = require("./routes/newsletter.routes.js");
const contactRoutes = require("./routes/contact.routes.js");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Correct routes
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/categories", categoryRoutes);
app.use("/newsletter", newsletterRoutes);
app.use("/contact", contactRoutes);
module.exports = app;
