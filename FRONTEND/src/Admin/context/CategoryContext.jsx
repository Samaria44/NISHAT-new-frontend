import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

export const CategoryContext = createContext();

const API_URL = `${API_BASE_URL}/categories`;

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(API_URL);
      setCategories(data);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // -------------------------
  // CATEGORY CRUD
  // -------------------------
  const addCategory = async (name) => {
    try {
      if (!name) throw new Error("Category name is required");
      await axios.post(API_URL, { name });
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const updateCategory = async (id, name) => {
    try {
      if (!name) throw new Error("Category name is required");
      await axios.put(`${API_URL}/${id}`, { name });
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const deleteCategory = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  // -------------------------
  // SUBCATEGORY CRUD
  // -------------------------
  const addSubcategory = async (catId, name) => {
    try {
      if (!name) throw new Error("Subcategory name is required");
      await axios.post(`${API_URL}/${catId}/sub`, { name });
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const updateSubcategory = async (catId, subId, name) => {
    try {
      if (!name) throw new Error("Subcategory name is required");
      await axios.put(`${API_URL}/${catId}/sub/${subId}`, { name });
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const deleteSubcategory = async (catId, subId) => {
    try {
      await axios.delete(`${API_URL}/${catId}/sub/${subId}`);
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
      await axios.put(`${API_URL}/${catId}/sub/${subId}/image`, formData, {
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
      await axios.put(`${API_URL}/${catId}/image`, formData, {
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
