require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zavaro');

// Use the actual User and Role models from the models directory
const { user: User, role: Role } = require('../models');

async function createAdminProperly() {
  try {
    console.log("🔧 Creating admin user properly...");

    // First, delete any existing admin user
    await User.deleteMany({ email: "admin@nishat.com" });
    console.log("🗑️ Cleared existing admin users");

    // Get admin role
    const adminRole = await Role.findOne({ name: "admin" });
    if (!adminRole) {
      console.log("❌ Admin role not found!");
      return;
    }

    // Create admin user with the exact same schema as expected
    const adminUser = new User({
      firstName: "Admin",
      lastName: "User",
      email: "admin@nishat.com",
      password: bcrypt.hashSync("admin123", 8),
      roles: [adminRole._id],
      created_at: new Date(),
      created_by: null,
      is_updated: false,
      is_deleted: false
    });

    await adminUser.save();
    console.log("✅ Created admin user:");
    console.log("   Email: admin@nishat.com");
    console.log("   Password: admin123");
    console.log("   Role: admin");
    console.log("   User ID:", adminUser._id);

    // Test the user can be found like the auth controller does
    const foundUser = await User.findOne({ email: "admin@nishat.com" }).populate("roles", "-__v").exec();
    
    if (foundUser) {
      console.log("✅ User can be found by auth controller:");
      console.log("   ID:", foundUser._id);
      console.log("   Email:", foundUser.email);
      console.log("   Roles:", foundUser.roles.map(r => r.name));
      
      // Test password
      const isValid = bcrypt.compareSync("admin123", foundUser.password);
      console.log("   Password valid:", isValid);
    }

    console.log("🎉 Admin creation complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("Stack:", error.stack);
    process.exit(1);
  }
}

createAdminProperly();
