const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

const checkDuplicateEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ message: "Email is already in use!" });
    }
    next();
  } catch (err) {
    console.error("checkDuplicateEmail error:", err);
    res.status(500).json({ message: "Server error during email check" });
  }
};

const checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let role of req.body.roles) {
      if (!ROLES.includes(role)) {
        return res.status(400).json({ message: `Role '${role}' does not exist!` });
      }
    }
  }
  next();
};

module.exports = { checkDuplicateEmail, checkRolesExisted };
