require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zavaro', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Simple User and Role schemas
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  password: String,
  email: { type: String, unique: true },
  roles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
  created_at: { type: Date, default: Date.now },
});

const roleSchema = new mongoose.Schema({
  name: String
});

const User = mongoose.model('User', userSchema);
const Role = mongoose.model('Role', roleSchema);

async function quickInit() {
  try {
    console.log("🔧 Quick initializing admin user...");

    // Create roles
    const roles = [
      { name: "user" },
      { name: "moderator" },
      { name: "admin" }
    ];

    for (const roleData of roles) {
      const existingRole = await Role.findOne({ name: roleData.name });
      if (!existingRole) {
        await Role.create(roleData);
        console.log(`✅ Created role: ${roleData.name}`);
      }
    }

    // Create admin user
    const adminEmail = "admin@nishat.com";
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const adminRole = await Role.findOne({ name: "admin" });
      
      const adminUser = new User({
        firstName: "Admin",
        lastName: "User",
        email: adminEmail,
        password: bcrypt.hashSync("admin123", 8),
        roles: [adminRole._id],
        created_at: new Date()
      });

      await adminUser.save();
      console.log("✅ Created admin user:");
      console.log("   Email: admin@nishat.com");
      console.log("   Password: admin123");
      console.log("   Role: admin");
    } else {
      console.log("ℹ️ Admin user already exists");
    }

    console.log("🎉 Quick admin initialization complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

quickInit();
