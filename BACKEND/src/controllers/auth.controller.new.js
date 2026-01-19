const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config/auth.config");
const db = require("../models");
const { user: User, role: Role, refreshToken: RefreshToken } = db;

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').populate('roles', 'name');
    res.status(200).json({
      success: true,
      data: users,
      count: users.length
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password').populate('roles', 'name');
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password; // Password should be updated separately
    delete updates.roles; // Roles should be updated separately
    
    const user = await User.findByIdAndUpdate(
      req.userId, 
      updates, 
      { new: true, runValidators: true }
    ).select('-password').populate('roles', 'name');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }
    
    res.status(200).json({
      success: true,
      data: user,
      message: "Profile updated successfully"
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// Signup
exports.signup = async (req, res) => {
  try {
    const { email, password, firstName, lastName, roles } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: "Email already exists!" 
      });
    }

    const user = new User({
      email,
      password: bcrypt.hashSync(password, 8),
      firstName,
      lastName,
      created_by: req.userId || null
    });

    // Handle roles
    if (roles && roles.length > 0) {
      const foundRoles = await Role.find({ name: { $in: roles } });
      user.roles = foundRoles.map(role => role._id);
    } else {
      const defaultRole = await Role.findOne({ name: "user" });
      user.roles = [defaultRole._id];
    }

    const savedUser = await user.save();
    
    // Populate roles for response
    await savedUser.populate('roles', 'name');
    
    res.status(201).json({ 
      success: true,
      data: {
        id: savedUser.id,
        email: savedUser.email,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        roles: savedUser.roles.map(role => role.name)
      },
      message: "User was registered successfully!" 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// Signin
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email }).populate("roles", "-__v").exec();
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "Invalid Email or Password!" 
      });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid Password!" 
      });
    }

    // Update last login
    user.last_login = new Date();
    await user.save();

    const token = jwt.sign({ 
      id: user._id, 
      roles: user.roles.map(role => role.name) 
    }, config.secret, { 
      expiresIn: config.jwtExpiration 
    });
    
    const refreshTokenObj = await RefreshToken.createToken(user);

    const authorities = user.roles.map(role => `ROLE_${role.name.toUpperCase()}`);

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: authorities,
        last_login: user.last_login,
        accessToken: token,
        refreshToken: refreshTokenObj,
      }
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// Update Password
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    const passwordIsValid = bcrypt.compareSync(currentPassword, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid current password" 
      });
    }

    user.password = bcrypt.hashSync(newPassword, 8);
    await user.save();
    
    res.status(200).json({ 
      success: true,
      message: "Password was updated successfully!" 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { id: user._id }, 
      config.secret, 
      { expiresIn: '1h' }
    );
    
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // TODO: Send email with reset token
    res.status(200).json({ 
      success: true,
      message: "Password reset email sent!" 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    const decoded = jwt.verify(token, config.secret);
    const user = await User.findOne({
      _id: decoded.id,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid or expired reset token" 
      });
    }

    user.password = bcrypt.hashSync(newPassword, 8);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    res.status(200).json({ 
      success: true,
      message: "Password reset successful!" 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// Refresh Token
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken: requestToken } = req.body;
    
    if (!requestToken) {
      return res.status(403).json({ 
        success: false,
        message: "Refresh Token is required!" 
      });
    }

    const refreshToken = await RefreshToken.findOne({ token: requestToken });
    
    if (!refreshToken) {
      return res.status(403).json({ 
        success: false,
        message: "Refresh Token is not in database!" 
      });
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      await RefreshToken.findByIdAndDelete(refreshToken._id);
      return res.status(403).json({ 
        success: false,
        message: "Refresh Token was expired!" 
      });
    }

    const user = await refreshToken.user;
    
    const newAccessToken = jwt.sign(
      { id: user._id, roles: user.roles },
      config.secret,
      { expiresIn: config.jwtExpiration }
    );

    return res.status(200).json({
      success: true,
      data: {
        accessToken: newAccessToken,
        refreshToken: refreshToken.token,
      }
    });
  } catch (err) {
    return res.status(500).send({ 
      success: false,
      message: err.message 
    });
  }
};

// Logout
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    await RefreshToken.deleteOne({ token: refreshToken });
    
    res.status(200).json({ 
      success: true,
      message: "Logout successful!" 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};
