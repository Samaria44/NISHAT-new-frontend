const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Import database connection
const connectDB = require("../src/config/database");

// Import routes
const authRoutes = require("../src/routes/auth");
const productRoutes = require("../src/routes/product.routes");
const orderRoutes = require("../src/routes/order.routes");
const categoryRoutes = require("../src/routes/category.routes");
const newsletterRoutes = require("../src/routes/newsletter.routes.js");
const contactRoutes = require("../src/routes/contact.routes.js");
const specialSaleRoutes = require("../src/routes/specialSale.routes");
const carouselRoutes = require("../src/routes/carousel.routes.js");
const saletextRoutes = require("../src/routes/saletext.routes.js");
const inventoryRoutes = require("../src/routes/inventory.routes");
const adminRoutes = require("../src/routes/adminRoutes");

const app = express();

// Middleware - Configure CORS for production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allowed origins
    const allowedOrigins = [
      'https://nishat-new-frontend.vercel.app',
      'https://nishat-backend-topaz.vercel.app',
      'http://localhost:3000',
      'http://localhost:8000'
    ];
    
    if (process.env.NODE_ENV === 'development') {
      // In development, allow all origins
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Health check
app.get("/", (req, res) => {
  res.send("Backend running on Vercel 🚀");
});

// Routes
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/categories", categoryRoutes);
app.use("/newsletter", newsletterRoutes);
app.use("/contact", contactRoutes);
app.use("/Admin", adminRoutes);
app.use("/specialsale/banner", saletextRoutes);
app.use("/specialsale", specialSaleRoutes);
app.use("/carousel", carouselRoutes);
app.use("/inventory", inventoryRoutes);

// Connect to database before exporting
connectDB()
  .then(() => {
    console.log('✅ Database connected successfully');
  })
  .catch((error) => {
    console.error('❌ Database connection error:', error.message);
  });

module.exports = app;
