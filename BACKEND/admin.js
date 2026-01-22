require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const db = require('./src/models');

// Hardcode MongoDB URI temporarily
const MONGODB_URI = 'mongodb+srv://samariatajamul_db_user:NC9m8WPtoa30qLyD@cluster0.s0qmlbq.mongodb.net/nishat_db';

const User = db.user;
const Role = db.role;

async function addAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    
    // Create admin role if not exists
    const adminRole = await Role.findOneAndUpdate(
      { name: 'admin' },
      { name: 'admin' },
      { upsert: true, new: true }
    );
    
    // Create admin user
    const hashedPassword = bcrypt.hashSync('admin123', 8);
    
    await User.findOneAndUpdate(
      { email: 'admin@nishat.com' },
      {
        email: 'admin@nishat.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        roles: [adminRole._id],
        isActive: true
      },
      { upsert: true, new: true }
    );
    
    console.log(' Admin user added/updated');
    console.log('Email: admin@nishat.com');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

addAdmin();
