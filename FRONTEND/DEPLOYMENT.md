# Frontend Deployment Guide

## CORS Error Fix

The CORS error occurs because the frontend (deployed on Vercel) is trying to access a backend at `localhost:8000`, which is blocked by browser security policies.

## Solution Options

### Option 1: Deploy Backend to Vercel (Recommended)

1. **Deploy Backend:**
   ```bash
   cd BACKEND
   vercel --prod
   ```

2. **Set Environment Variable in Vercel Frontend:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add: `REACT_APP_BACKEND_URL=https://your-backend-url.vercel.app`

### Option 2: Use Local Backend (Development)

Keep backend running locally and access frontend through local development.

### Option 3: Update CORS Configuration

The backend has been updated with proper CORS configuration for both development and production.

## Environment Variables

### Frontend (.env.local)
```
REACT_APP_BACKEND_URL=http://localhost:8000  # For local development
```

### Backend (.env)
```
MONGODB_URI=mongodb+srv://samariatajamul_db_user:NC9m8WPtoa30qLyD@cluster0.s0qmlbq.mongodb.net/nishat_db
JWT_SECRET=your-jwt-secret-key
NODE_ENV=production
PORT=8000
```

## API Configuration

The frontend now automatically switches between:
- **Development:** `http://localhost:8000`
- **Production:** `https://nishat-backend.vercel.app` (or your deployed backend URL)

## Testing

After deployment, test admin login:
1. Backend should be accessible at your Vercel URL
2. Frontend should successfully call `/auth/signin`
3. No CORS errors should occur

## Troubleshooting

If CORS still occurs:
1. Check backend deployment URL
2. Verify environment variables in Vercel
3. Check browser network tab for actual API calls
4. Ensure backend CORS allows your frontend domain
