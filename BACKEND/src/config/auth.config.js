//C:\Users\samar\Desktop\GCS\NISHAT-new\BACKEND\src\config\auth.config.js
module.exports = {
    secret: process.env.PORT,
     jwtExpiration: 3600,         // 1 hour
     jwtRefreshExpiration: 86400, // 24 hours
  
    /* for test */
    // jwtExpiration: 60,          // 1 minute
    // jwtRefreshExpiration: 120,  // 2 minutes
  };
  