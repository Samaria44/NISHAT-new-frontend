# Vercel Deployment Guide

## Environment Variables Required

Add these environment variables in your Vercel dashboard:

### Database Configuration
- `MONGODB_URI=mongodb+srv://samariatajamul_db_user:NC9m8WPtoa30qLyD@cluster0.s0qmlbq.mongodb.net/nishat_db`

### Email Configuration (Gmail)
- `EMAIL_USER=samariatajamul@gmail.com`
- `EMAIL_PASS=epez nrga xgzt lufn`

### JWT Configuration
- `JWT_SECRET=your-jwt-secret-key`

### Server Configuration
- `PORT=8000`
- `NODE_ENV=production`

## Deployment Steps

1. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

Or connect your GitHub repository to Vercel for automatic deployments.

## File Structure for Vercel

```
BACKEND/
├── api/
│   └── index.js          # Serverless function entry point
├── src/
│   ├── app.js            # Express app
│   ├── config/
│   ├── models/
│   ├── routes/
│   └── ...
├── vercel.json           # Vercel configuration
├── package.json
└── .env                  # Local environment (not deployed)
```

## Important Notes

- The `.env` file is not deployed to Vercel
- All environment variables must be configured in Vercel dashboard
- MongoDB Atlas connection string should be whitelisted for Vercel's IP ranges
- The app runs as serverless functions, not as a continuous server
