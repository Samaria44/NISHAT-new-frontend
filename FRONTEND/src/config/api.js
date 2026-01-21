// API Configuration
// Production should use deployed backend URL when available
// For development, use localhost backend
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.REACT_APP_BACKEND_URL || "https://nishat-backend.vercel.app"  // Default to deployed backend
  : "http://localhost:8000";

export const createApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;
