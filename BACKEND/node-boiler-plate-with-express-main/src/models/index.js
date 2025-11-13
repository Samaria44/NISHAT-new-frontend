const mongoose = require("mongoose");

// Correct relative paths for models
const Role = require("./Role");
const User = require("./Users");
const Product = require("./productModel");   
const Order = require("./orderModel");       

const db = {};
db.mongoose = mongoose;
db.role = Role;
db.user = User;


module.exports = db;
