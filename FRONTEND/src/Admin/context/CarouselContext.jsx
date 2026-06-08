import { createContext, useState } from "react";
import axiosInstance from "../../utils/axiosInterceptor";
import { API_BASE_URL } from "../../config/api";

export const CarouselContext = createContext();

// Absolute URL for image src display only
const BACKEND_URL = API_BASE_URL.replace(/\/+$/, "");

export const CarouselProvider = ({ children }) => {
  const [carouselImages, setCarouselImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const getCarouselImages = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/carousel");
      setCarouselImages(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching carousel images:", error);
      setCarouselImages([]);
    } finally {
      setLoading(false);
    }
  };

  const getActiveCarouselImages = async () => {
    try {
      const response = await axiosInstance.get("/carousel/active");
      console.log("Carousel API response:", response.data);
      setCarouselImages(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching active carousel images:", error);
      setCarouselImages([]);
    }
  };

  const addCarouselImage = async (carouselData) => {
    try {
      const response = await axiosInstance.post("/carousel", carouselData);
      setCarouselImages((prev) => [...prev, response.data]);
      return response.data;
    } catch (error) {
      console.error("Error adding carousel image:", error.response?.data || error);
      throw error;
    }
  };

  const updateCarouselImage = async (id, updateData) => {
    try {
      const response = await axiosInstance.put(`/carousel/${id}`, updateData);
      setCarouselImages((prev) =>
        prev.map((img) => (img._id === id ? response.data : img))
      );
      return response.data;
    } catch (error) {
      console.error("Error updating carousel:", error.response?.data || error);
      throw error;
    }
  };

  const uploadCarouselImageFile = async (id, file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      const response = await axiosInstance.put(
        `/carousel/${id}/image`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setCarouselImages((prev) =>
        prev.map((img) => (img._id === id ? response.data : img))
      );
      return response.data;
    } catch (error) {
      console.error("Error uploading carousel image file:", error.response?.data || error);
      throw error;
    }
  };

  const deleteCarouselImage = async (id) => {
    try {
      await axiosInstance.delete(`/carousel/${id}`);
      setCarouselImages((prev) => prev.filter((img) => img._id !== id));
    } catch (error) {
      console.error("Error deleting carousel image:", error);
      throw error;
    }
  };

  const toggleCarouselImage = async (id, active) => {
    try {
      const response = await axiosInstance.put(`/carousel/${id}`, { active });
      setCarouselImages((prev) =>
        prev.map((img) => (img._id === id ? { ...img, active } : img))
      );
      return response.data;
    } catch (error) {
      console.error("Error toggling carousel image:", error);
      throw error;
    }
  };

  return (
    <CarouselContext.Provider
      value={{
        carouselImages,
        loading,
        getCarouselImages,
        getActiveCarouselImages,
        addCarouselImage,
        updateCarouselImage,
        uploadCarouselImageFile,
        deleteCarouselImage,
        toggleCarouselImage,
      }}
    >
      {children}
    </CarouselContext.Provider>
  );
};
