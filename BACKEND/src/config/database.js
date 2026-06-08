const mongoose = require("mongoose");
const db = require("../models");
const Role = db.role;

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error(
      "MONGODB_URI environment variable is not set. Please configure it in your .env file."
    );
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    });

    console.log("Successfully connected to MongoDB.");
    await initializeRoles();
    console.log("MongoDB ready.");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    // Re-throw instead of calling process.exit so callers can handle the error
    throw error;
  }
};

module.exports = connectDB;

async function initializeRoles() {
  try {
    const count = await Role.estimatedDocumentCount();
    if (count === 0) {
      await new Role({ name: "user" }).save();
      console.log("Added 'user' to roles collection");

      await new Role({ name: "moderator" }).save();
      console.log("Added 'moderator' to roles collection");

      await new Role({ name: "admin" }).save();
      console.log("Added 'admin' to roles collection");
    }
  } catch (err) {
    console.error("Error initializing roles:", err);
  }
}
