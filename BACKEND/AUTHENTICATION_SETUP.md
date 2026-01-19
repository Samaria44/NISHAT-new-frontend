# JWT Authentication with Role-Based Access Control

## 📁 Files Created/Updated

### **New Authentication System:**
- `src/middleware/auth.js` - Enhanced authentication middleware
- `src/controllers/auth.controller.new.js` - Improved auth controller
- `src/routes/auth.routes.js` - New auth routes
- `src/config/auth.config.new.js` - Updated auth config

### **Existing Files to Replace:**
- `src/controllers/auth.controller.js` → Replace with `.new.js` version
- `src/middleware/authMiddleware.js` → Replace with new `auth.js`
- `src/config/auth.config.js` → Replace with `.new.js` version
- `src/routes/auth.js` → Replace with new `auth.routes.js`

## 🔐 Authentication Features

### **JWT Token System:**
- ✅ Access tokens (24h expiry)
- ✅ Refresh tokens (7d expiry)
- ✅ Automatic token refresh
- ✅ Token validation middleware

### **Role-Based Access Control:**
- **Admin**: Full access (read, write, delete, manage_users, manage_roles)
- **Moderator**: Moderate access (read, write, moderate)
- **User**: Basic access (read only)

### **Middleware Functions:**
```javascript
const { verifyToken, isAdmin, isModerator, isUser, hasAnyRole, optionalAuth } = require('./middleware/auth');

// Usage examples:
router.get('/users', [verifyToken, isAdmin], getAllUsers);
router.get('/content', [verifyToken, hasAnyRole(['admin', 'moderator'])], getContent);
router.get('/profile', verifyToken, getProfile);
router.get('/public', optionalAuth, getPublicContent);
```

### **API Endpoints:**

#### **Public (No Auth Required):**
- `POST /auth/signup` - User registration
- `POST /auth/signin` - User login
- `POST /auth/refresh-token` - Refresh access token
- `POST /auth/forgot-password` - Forgot password
- `POST /auth/reset-password` - Reset password

#### **Protected (Token Required):**
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update user profile
- `POST /auth/update-password` - Update password
- `POST /auth/logout` - Logout

#### **Admin Only:**
- `GET /auth/users` - Get all users

#### **Moderator/Admin:**
- `GET /auth/moderator-users` - Get all users (moderator+)

## 🚀 Setup Instructions

### **1. Replace Existing Files:**
```bash
# Backup old files
mv src/controllers/auth.controller.js src/controllers/auth.controller.backup.js
mv src/middleware/authMiddleware.js src/middleware/authMiddleware.backup.js
mv src/config/auth.config.js src/config/auth.config.backup.js
mv src/routes/auth.js src/routes/auth.backup.js

# Use new files
mv src/controllers/auth.controller.new.js src/controllers/auth.controller.js
mv src/middleware/auth.js src/middleware/authMiddleware.js
mv src/config/auth.config.new.js src/config/auth.config.js
mv src/routes/auth.routes.js src/routes/auth.js
```

### **2. Update App Routes:**
In `src/app.js`, replace:
```javascript
const authRoutes = require("./routes/auth");
```
With:
```javascript
const authRoutes = require("./routes/auth.routes");
```

### **3. Initialize Roles:**
Create a script to initialize default roles:
```javascript
// src/scripts/init-roles.js
const db = require("../models");
const Role = db.role;

const roles = [
  { name: "user" },
  { name: "moderator" },
  { name: "admin" }
];

Role.insertMany(roles, (err, data) => {
  if (err) console.log("Error:", err);
  else console.log("Roles initialized:", data);
});
```

### **4. Environment Variables:**
Add to `.env`:
```env
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRATION=24h
JWT_REFRESH_EXPIRATION=7d
```

## 🔍 Response Format

### **Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### **Error Response:**
```json
{
  "success": false,
  "message": "Error description"
}
```

## 🛡️ Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token validation
- ✅ Role-based access control
- ✅ Token expiration handling
- ✅ Refresh token rotation
- ✅ Protected routes
- ✅ Admin-only endpoints

## 📱 Frontend Integration

### **Login Request:**
```javascript
const response = await axios.post('/auth/signin', {
  email: 'user@example.com',
  password: 'password123'
});

// Store tokens
localStorage.setItem('accessToken', response.data.data.accessToken);
localStorage.setItem('refreshToken', response.data.data.refreshToken);
```

### **Protected Request:**
```javascript
const response = await axios.get('/auth/profile', {
  headers: {
    'x-access-token': localStorage.getItem('accessToken')
  }
});
```

### **Token Refresh:**
```javascript
const response = await axios.post('/auth/refresh-token', {
  refreshToken: localStorage.getItem('refreshToken')
});

// Update stored token
localStorage.setItem('accessToken', response.data.data.accessToken);
```

This authentication system provides secure, role-based access control for your NISHAT application! 🎉
