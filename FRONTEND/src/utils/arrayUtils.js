/**
 * Array utility functions to prevent map errors
 */

export const safeMap = (array, callback) => {
  return Array.isArray(array) ? array.map(callback) : [];
};

export const safeFilter = (array, callback) => {
  return Array.isArray(array) ? array.filter(callback) : [];
};

export const safeReduce = (array, callback, initialValue) => {
  return Array.isArray(array) ? array.reduce(callback, initialValue) : initialValue;
};

export const ensureArray = (data) => {
  return Array.isArray(data) ? data : [];
};
