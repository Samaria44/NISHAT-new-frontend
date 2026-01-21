// API Configuration with fallback handling
export const getApiBaseUrl = () => {
  // Check if we have a custom backend URL from environment
  const customBackendUrl = process.env.REACT_APP_BACKEND_URL;
  
  // If in development, always use localhost
  if (process.env.NODE_ENV === 'development') {
    return "http://localhost:8000";
  }
  
  // If in production and we have a custom backend URL, use it
  if (process.env.NODE_ENV === 'production' && customBackendUrl) {
    // Validate that it's not the placeholder
    if (!customBackendUrl.includes('your-backend-url.vercel.app')) {
      return customBackendUrl;
    }
  }
  
  // Default fallback - use the deployed backend URL
  return "https://nishat-backend-topaz.vercel.app";
};

export const API_BASE_URL = getApiBaseUrl();

// Helper to check if API is available
export const isApiAvailable = () => {
  return API_BASE_URL !== null;
};
