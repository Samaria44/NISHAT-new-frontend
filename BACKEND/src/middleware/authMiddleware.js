//C:\Users\samar\Desktop\GCS\NISHAT-new\BACKEND\src\middleware\authMiddleware.js
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

const catchError = (err, res) => {
  if (err.name === "TokenExpiredError") return res.status(401).send({ message: "Access Token expired!" });
  return res.status(401).send({ message: "Unauthorized!" });
};

const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) return res.status(403).send({ message: "No token provided!" });

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) return catchError(err, res);
    req.userId = decoded.id;
    req.userRoles = decoded.roles;
    next();
  });
};

const isAdmin = (req, res, next) => {
  User.findById(req.userId).populate("roles").exec((err, user) => {
    if (err) return res.status(500).send({ message: err });
    if (!user) return res.status(404).send({ message: "User not found" });

    for (let role of user.roles) {
      if (role.name === "admin") return next();
    }
    return res.status(403).send({ message: "Require Admin Role!" });
  });
};

const isModerator = (req, res, next) => {
  User.findById(req.userId).populate("roles").exec((err, user) => {
    if (err) return res.status(500).send({ message: err });
    for (let role of user.roles) {
      if (role.name === "moderator") return next();
    }
    return res.status(403).send({ message: "Require Moderator Role!" });
  });
};

module.exports = { verifyToken, isAdmin, isModerator };
