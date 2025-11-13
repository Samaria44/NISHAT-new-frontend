require("dotenv").config(); // Load environment variables first!

const app = require("./src/app");
const connectDB = require("./src/config/database");

const PORT = process.env.PORT || 8000;

// Connect to MongoDB first, then start the server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(` Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(" MongoDB connection error:", error.message);
    process.exit(1); // Exit process if DB connection fails
  });
