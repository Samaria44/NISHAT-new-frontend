require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zavaro');

// Use the actual User and Role models from the models directory
const { user: User, role: Role } = require('../models');

async function debugSignin() {
  try {
    console.log("🔍 Debugging signin process...");

    // Step 1: Find user like the auth controller does
    const email = "admin@nishat.com";
    const password = "admin123";
    
    console.log("📧 Looking for user with email:", email);
    
    const user = await User.findOne({ email }).populate("roles", "-__v").exec();
    
    if (!user) {
      console.log("❌ User not found!");
      return;
    }

    console.log("✅ User found:");
    console.log("   ID:", user._id);
    console.log("   Email:", user.email);
    console.log("   Name:", user.firstName, user.lastName);
    console.log("   Has password:", !!user.password);
    console.log("   Password length:", user.password ? user.password.length : 0);
    console.log("   Roles:", user.roles.map(r => r.name));

    // Step 2: Test password comparison like the auth controller
    console.log("\n🔐 Testing password comparison...");
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    console.log("   Password valid:", passwordIsValid);

    if (!passwordIsValid) {
      console.log("❌ Password comparison failed!");
      
      // Test with different password
      const testPasswords = ["admin123", "admin", "password", "123456"];
      for (const testPwd of testPasswords) {
        const isValid = bcrypt.compareSync(testPwd, user.password);
        console.log(`   Test password "${testPwd}": ${isValid}`);
      }
    } else {
      console.log("✅ Password comparison successful!");
    }

    // Step 3: Test JWT token generation
    console.log("\n🎟️ Testing JWT token generation...");
    const jwt = require("jsonwebtoken");
    const config = require("../config/auth.config");
    
    const token = jwt.sign({ 
      id: user._id, 
      roles: user.roles.map(role => role.name) 
    }, config.secret, { 
      expiresIn: config.jwtExpiration 
    });
    
    console.log("✅ Token generated successfully");
    console.log("   Token length:", token.length);

    console.log("\n🎉 Debugging complete!");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("Stack:", error.stack);
  }
  
  process.exit(0);
}

debugSignin();
