// API Configuration
// In production, this should be your deployed backend URL
// For now, using localhost - you need to deploy backend separately
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.REACT_APP_BACKEND_URL || "http://localhost:8000"
  : "http://localhost:8000";

export const createApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;
