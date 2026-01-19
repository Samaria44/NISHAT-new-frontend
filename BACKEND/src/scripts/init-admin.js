const db = require("../models");
const { user: User, role: Role } = db;
const bcrypt = require("bcryptjs");

async function initializeAdmin() {
  try {
    console.log("🔧 Initializing admin user...");

    // Create roles if they don't exist
    const roles = [
      { name: "user" },
      { name: "moderator" },
      { name: "admin" }
    ];

    for (const roleData of roles) {
      const existingRole = await Role.findOne({ name: roleData.name });
      if (!existingRole) {
        await Role.create(roleData);
        console.log(` Created role: ${roleData.name}`);
      } else {
        console.log(`ℹ Role already exists: ${roleData.name}`);
      }
    }

    // Create admin user if doesn't exist
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
        created_by: null // Self-created
      });

      await adminUser.save();
      console.log(" Created admin user:");
      console.log("   Email: admin@nishat.com");
      console.log("   Password: admin123");
      console.log("   Role: admin");
    } else {
      console.log("ℹ Admin user already exists");
    }

    console.log("🎉 Admin initialization complete!");
    process.exit(0);
  } catch (error) {
    console.error(" Error initializing admin:", error);
    process.exit(1);
  }
}

initializeAdmin();
