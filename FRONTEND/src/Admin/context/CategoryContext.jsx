import { createContext, useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInterceptor";

export const CategoryContext = createContext();

// Relative paths — axiosInstance already has baseURL configured
const API_URL = "/categories";

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const { data } = await axiosInstance.get(API_URL);
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ── CATEGORY CRUD ──────────────────────────────
  const addCategory = async (name) => {
    try {
      if (!name) throw new Error("Category name is required");
      await axiosInstance.post(API_URL, { name });
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const updateCategory = async (id, name) => {
    try {
      if (!name) throw new Error("Category name is required");
      await axiosInstance.put(`${API_URL}/${id}`, { name });
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const deleteCategory = async (id) => {
    try {
      await axiosInstance.delete(`${API_URL}/${id}`);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  // ── SUBCATEGORY CRUD ───────────────────────────
  const addSubcategory = async (catId, name) => {
    try {
      if (!name) throw new Error("Subcategory name is required");
      await axiosInstance.post(`${API_URL}/${catId}/sub`, { name });
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const updateSubcategory = async (catId, subId, name) => {
    try {
      if (!name) throw new Error("Subcategory name is required");
      await axiosInstance.put(`${API_URL}/${catId}/sub/${subId}`, { name });
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const deleteSubcategory = async (catId, subId) => {
    try {
      await axiosInstance.delete(`${API_URL}/${catId}/sub/${subId}`);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const updateSubcategoryImage = async (catId, subId, file) => {
    try {
      if (!file) throw new Error("No file selected");
      const formData = new FormData();
      formData.append("image", file);
      await axiosInstance.put(`${API_URL}/${catId}/sub/${subId}/image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const updateCategoryImage = async (catId, file) => {
    try {
      if (!file) throw new Error("No file selected");
      const formData = new FormData();
      formData.append("image", file);
      await axiosInstance.put(`${API_URL}/${catId}/image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <CategoryContext.Provider
      value={{
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        addSubcategory,
        updateSubcategory,
        deleteSubcategory,
        updateSubcategoryImage,
        updateCategoryImage,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
