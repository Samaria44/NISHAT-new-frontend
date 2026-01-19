const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models");
const { user: User, role: Role } = db;

// Verify JWT Token
const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"] || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(403).json({ 
      success: false,
      message: "No token provided!" 
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ 
        success: false,
        message: "Unauthorized!" 
      });
    }
    
    req.userId = decoded.id;
    req.userRoles = decoded.roles || [];
    next();
  });
};

// Check if user has specific role
const hasRole = (role) => {
  return (req, res, next) => {
    User.findById(req.userId).populate("roles").exec((err, user) => {
      if (err) {
        return res.status(500).json({ 
          success: false,
          message: "Database error" 
        });
      }
      
      if (!user) {
        return res.status(404).json({ 
          success: false,
          message: "User not found" 
        });
      }

      const userRoles = user.roles.map(userRole => userRole.name);
      
      if (userRoles.includes(role)) {
        return next();
      }
      
      return res.status(403).json({ 
        success: false,
        message: `Require ${role} Role!` 
      });
    });
  };
};

// Role-based middleware
const isAdmin = hasRole("admin");
const isModerator = hasRole("moderator");
const isUser = hasRole("user");

// Check if user has any of the specified roles
const hasAnyRole = (roles) => {
  return (req, res, next) => {
    User.findById(req.userId).populate("roles").exec((err, user) => {
      if (err) {
        return res.status(500).json({ 
          success: false,
          message: "Database error" 
        });
      }
      
      if (!user) {
        return res.status(404).json({ 
          success: false,
          message: "User not found" 
        });
      }

      const userRoles = user.roles.map(userRole => userRole.name);
      const hasRequiredRole = roles.some(role => userRoles.includes(role));
      
      if (hasRequiredRole) {
        return next();
      }
      
      return res.status(403).json({ 
        success: false,
        message: `Access denied. Required roles: ${roles.join(', ')}` 
      });
    });
  };
};

// Optional authentication (doesn't fail if no token)
const optionalAuth = (req, res, next) => {
  const token = req.headers["x-access-token"] || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    req.userId = null;
    req.userRoles = [];
    return next();
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      req.userId = null;
      req.userRoles = [];
      return next();
    }
    
    req.userId = decoded.id;
    req.userRoles = decoded.roles || [];
    next();
  });
};

module.exports = {
  verifyToken,
  isAdmin,
  isModerator,
  isUser,
  hasAnyRole,
  optionalAuth
};
