require('dotenv').config();
const mongoose = require('mongoose');

console.log("🔍 Checking database connections...");

// Check current connection state
console.log("MongoDB connection state:", mongoose.connection.readyState);
console.log("MongoDB connection host:", mongoose.connection.host);
console.log("MongoDB connection name:", mongoose.connection.name);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zavaro');

mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
  console.log('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('❌ MongoDB disconnected');
});

// Use the actual User and Role models from the models directory
const { user: User, role: Role } = require('../models');

async function checkDatabase() {
  try {
    // Wait for connection
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log("\n📊 Database statistics:");
    
    // Count users
    const userCount = await User.countDocuments();
    console.log("Total users:", userCount);
    
    // Count roles
    const roleCount = await Role.countDocuments();
    console.log("Total roles:", roleCount);
    
    // List all users
    const users = await User.find({}, { email: 1, firstName: 1, lastName: 1 });
    console.log("\n👥 All users:");
    users.forEach(user => {
      console.log(`  - ${user.email} (${user.firstName} ${user.lastName})`);
    });
    
    // List all roles
    const roles = await Role.find({}, { name: 1 });
    console.log("\n🔐 All roles:");
    roles.forEach(role => {
      console.log(`  - ${role.name}`);
    });
    
    // Try to find admin user
    const admin = await User.findOne({ email: "admin@nishat.com" });
    console.log("\n🔍 Admin user search:");
    console.log("Found admin:", !!admin);
    if (admin) {
      console.log("Admin ID:", admin._id);
      console.log("Admin email:", admin.email);
    }
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
  
  process.exit(0);
}

checkDatabase();
