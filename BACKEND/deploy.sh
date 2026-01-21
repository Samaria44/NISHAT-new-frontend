#!/bin/bash

echo "🚀 Deploying Backend to Vercel..."

# Deploy backend
vercel --prod

echo "✅ Backend deployed successfully!"
echo "📝 Don't forget to update frontend environment variable:"
echo "   REACT_APP_BACKEND_URL=https://nishat-backend-topaz.vercel.app"
echo ""
echo "🔄 Then redeploy frontend:"
echo "   cd ../FRONTEND"
echo "   vercel --prod"
