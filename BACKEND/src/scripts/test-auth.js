require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zavaro');

// Use the actual User and Role models from the models directory
const { user: User, role: Role } = require('../models');

async function testAuth() {
  try {
    console.log("🔍 Testing authentication...");

    // Find admin user
    const admin = await User.findOne({ email: "admin@nishat.com" }).populate('roles');
    
    if (admin) {
      console.log("✅ Found admin user:");
      console.log("   Email:", admin.email);
      console.log("   Name:", admin.firstName, admin.lastName);
      console.log("   Roles:", admin.roles.map(r => r.name));
      
      // Test password
      const isValid = bcrypt.compareSync("admin123", admin.password);
      console.log("   Password valid:", isValid);
      
      if (isValid) {
        console.log("🎉 Authentication test passed!");
      } else {
        console.log("❌ Password verification failed");
        
        // Update password
        console.log("🔧 Updating admin password...");
        admin.password = bcrypt.hashSync("admin123", 8);
        await admin.save();
        console.log("✅ Password updated successfully");
      }
    } else {
      console.log("❌ Admin user not found");
    }
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

testAuth();
