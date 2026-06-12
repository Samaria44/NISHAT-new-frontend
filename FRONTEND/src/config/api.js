import { API_BASE_URL, isApiAvailable } from './apiConfig';

export const getImageUrl = (path) => {
  if (!path) return null;
  const base = API_BASE_URL.replace(/\/+$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
};

export const createApiUrl = (endpoint) => {
  if (!isApiAvailable()) {
    console.error('API not available. Please deploy backend or configure REACT_APP_BACKEND_URL');
    return null;
  }
  return `${API_BASE_URL}${endpoint}`;
};

export { API_BASE_URL, isApiAvailable };
