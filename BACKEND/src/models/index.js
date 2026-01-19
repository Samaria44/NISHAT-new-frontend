const mongoose = require("mongoose");

// Correct relative paths for models
const Role = require("./Role");
const User = require("./Users");
const Product = require("./productModel");   
const Order = require("./orderModel");       
const RefreshToken = require("./RefreshToken");
// const db = {};
// db.mongoose = mongoose;
// db.role = Role;
// db.user = User;
// 
//  RefreshToken,   // ✅ make sure key matches
//   ROLES: ["user", "admin", "moderator"],
// module.exports = db;




module.exports = {
  user: User,
  role: Role,
  refreshToken: RefreshToken,   // ✅ make sure key matches
  ROLES: ["user", "admin", "moderator"],
};
