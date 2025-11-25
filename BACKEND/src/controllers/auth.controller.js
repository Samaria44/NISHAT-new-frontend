//C:\Users\samar\Desktop\GCS\NISHAT-new\BACKEND\src\controllers\auth.controller.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config/auth.config");
const db = require("../models");
const { user: User, role: Role, RefreshToken } = db;

// Signup
exports.signup = async (req, res) => {
  try {
    const user = new User({
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      created_by: req.body.created_by
    });

    if (req.body.roles) {
      const roles = await Role.find({ name: { $in: req.body.roles } });
      user.roles = roles.map(role => role._id);
    } else {
      const role = await Role.findOne({ name: "user" });
      user.roles = [role._id];
    }

    const savedUser = await user.save();
    res.status(201).send({ id: savedUser.id, message: "User was registered successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Signin
exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }).populate("roles", "-__v").exec();
    if (!user) return res.status(404).send({ message: "Invalid Email or Password!" });

    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid)
      return res.status(401).send({ accessToken: null, message: "Invalid Password!" });

    const token = jwt.sign({ id: user.id, roles: user.roles }, config.secret, { expiresIn: config.jwtExpiration });
    const refreshToken = await RefreshToken.createToken(user);

    const authorities = user.roles.map(role => `ROLE_${role.name.toUpperCase()}`);

    res.status(200).send({
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: authorities,
      last_login: user.last_login,
      accessToken: token,
      refreshToken: refreshToken,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Update Password
exports.updatePassword = async (req, res) => {
  try {
    const accessToken = req.headers["x-access-token"];
    const decoded = jwt.verify(accessToken, config.secret);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).send({ message: "User not found" });

    const passwordIsValid = bcrypt.compareSync(req.body.currentPassword, user.password);
    if (!passwordIsValid) return res.status(401).send({ message: "Invalid current password" });

    user.password = bcrypt.hashSync(req.body.newPassword, 8);
    await user.save();
    res.send({ message: "Password was updated successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).send({ message: "User not found" });

    const resetToken = jwt.sign({ id: user._id }, config.secret, { expiresIn: "1h" });
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    res.send({ message: "Password reset token generated successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const user = await User.findOne({ resetPasswordToken: req.body.token });
    if (!user) return res.status(404).send({ message: "Invalid or expired reset token" });
    if (user.resetPasswordExpires < Date.now()) return res.status(400).send({ message: "Reset token has expired" });

    user.password = bcrypt.hashSync(req.body.newPassword, 8);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.send({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Refresh Token
exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;
  if (!requestToken) return res.status(403).json({ message: "Refresh Token is required!" });

  try {
    const refreshToken = await RefreshToken.findOne({ token: requestToken });
    if (!refreshToken) return res.status(403).json({ message: "Refresh token is not in database!" });

    if (RefreshToken.verifyExpiration(refreshToken)) {
      await RefreshToken.findByIdAndRemove(refreshToken._id);
      return res.status(403).json({ message: "Refresh token was expired. Please login again." });
    }

    const newAccessToken = jwt.sign({ id: refreshToken.user._id }, config.secret, { expiresIn: config.jwtExpiration });
    res.status(200).json({ accessToken: newAccessToken, refreshToken: refreshToken.token });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
