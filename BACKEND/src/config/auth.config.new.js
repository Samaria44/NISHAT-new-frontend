module.exports = {
  secret: process.env.JWT_SECRET || "bezkoder-secret-key",
  jwtExpiration: process.env.JWT_EXPIRATION || "24h",
  jwtRefreshExpiration: process.env.JWT_REFRESH_EXPIRATION || "7d",
  // Add role-based permissions
  permissions: {
    admin: ["read", "write", "delete", "manage_users", "manage_roles"],
    moderator: ["read", "write", "moderate"],
    user: ["read"]
  }
};
