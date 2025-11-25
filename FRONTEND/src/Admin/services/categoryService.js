import axios from "axios";

const API = "http://localhost:8000/categories";

// CATEGORY CRUD
export const getCategories = async () => {
  const res = await axios.get(API);
  return res.data;
};

export const addCategory = async (name) => await axios.post(API, { name });
export const updateCategory = async (categoryId, name) =>
  await axios.put(`${API}/${categoryId}`, { name });
export const deleteCategory = async (categoryId) =>
  await axios.delete(`${API}/${categoryId}`);

// SUBCATEGORY CRUD
export const addSubcategory = async (categoryId, name) =>
  await axios.post(`${API}/${categoryId}/sub`, { name });
export const updateSubcategory = async (categoryId, subId, name) =>
  await axios.put(`${API}/${categoryId}/sub/${subId}`, { name });
export const deleteSubcategory = async (categoryId, subId) =>
  await axios.delete(`${API}/${categoryId}/sub/${subId}`);

// GET CATEGORY BY SLUG (frontend match)
export const getCategoryBySlug = async (slug) => {
  const res = await axios.get(`${API}/slug/${slug}`);
  return res.data;
};
