require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const db = require("./src/models");

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Error: MONGODB_URI environment variable is not set.");
  process.exit(1);
}

const User = db.user;
const Role = db.role;

async function addAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);

    // Create admin role if not exists
    const adminRole = await Role.findOneAndUpdate(
      { name: "admin" },
      { name: "admin" },
      { upsert: true, new: true }
    );

    const adminEmail = process.env.ADMIN_EMAIL || "admin@nishat.com";
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error(
        "Error: ADMIN_PASSWORD environment variable is not set. Refusing to create admin with a default password."
      );
      process.exit(1);
    }

    const hashedPassword = bcrypt.hashSync(adminPassword, 8);

    const adminUser = await User.findOneAndUpdate(
      { email: adminEmail },
      {
        email: adminEmail,
        password: hashedPassword,
        firstName: "Admin",
        lastName: "User",
        roles: [adminRole._id],
        isActive: true,
      },
      { upsert: true, new: true }
    );

    console.log("Admin user added/updated successfully.");
    console.log("Email:", adminEmail);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
  }
}

addAdmin();
