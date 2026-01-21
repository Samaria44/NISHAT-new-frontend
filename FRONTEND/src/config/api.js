export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? "https://nishat-new-frontend.vercel.app" 
  : "http://localhost:8000";

export const createApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;
