const express = require("express");
require("dotenv").config();
const app = require("../src/app");
const connectDB = require("../src/config/database");

// Global variable to store the app instance
let serverlessApp;

// Initialize the serverless function
async function initializeServerlessApp() {
  if (!serverlessApp) {
    try {
      // Connect to MongoDB
      await connectDB();
      console.log("MongoDB connected successfully");
      
      // Export the app as a serverless function
      serverlessApp = app;
    } catch (error) {
      console.error("Failed to initialize serverless app:", error);
      throw error;
    }
  }
  return serverlessApp;
}

// Vercel serverless function handler
module.exports = async (req, res) => {
  try {
    const app = await initializeServerlessApp();
    return app(req, res);
  } catch (error) {
    console.error("Serverless function error:", error);
    res.status(500).json({ 
      error: "Internal Server Error",
      message: error.message 
    });
  }
};
