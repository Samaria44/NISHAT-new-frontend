const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

const checkDuplicateEmail = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send({ message: "Email is already in use!" });
  next();
};

const checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let role of req.body.roles) {
      if (!ROLES.includes(role)) return res.status(400).send({ message: `Role ${role} does not exist!` });
    }
  }
  next();
};

module.exports = { checkDuplicateEmail, checkRolesExisted };
