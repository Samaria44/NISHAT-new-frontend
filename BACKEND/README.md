# NISHAT Backend

## Vercel Deployment

### Prerequisites
- Node.js environment variables configured
- MongoDB Atlas connection string
- JWT secret configured

### Environment Variables (Required for Vercel)
```
MONGODB_URI=mongodb+srv://samariatajamul_db_user:NC9m8WPtoa30qLyD@cluster0.s0qmlbq.mongodb.net/nishat_db
JWT_SECRET=your-jwt-secret-key
NODE_ENV=production
```

### Deployment Steps
1. Push backend code to separate repository or branch
2. Connect to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### API Endpoints
- `POST /auth/signin` - Admin/User login
- `GET /products` - Get products
- `GET /categories` - Get categories
- And more...

### Frontend Configuration
After deploying backend, update frontend environment variable:
```
REACT_APP_BACKEND_URL=https://your-backend-vercel-url.vercel.app
```
