import axios from "axios";
import { createContext, useState } from "react";
import { API_BASE_URL } from "../../config/api";

export const CarouselContext = createContext();

export const CarouselProvider = ({ children }) => {
  const [carouselImages, setCarouselImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get all carousel images (for admin)
  const getCarouselImages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/carousel`);
      setCarouselImages(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching carousel images:", error);
      setCarouselImages([]);
    } finally {
      setLoading(false);
    }
  };

  // Get active carousel images (for frontend display)
  const getActiveCarouselImages = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/carousel/active`);
      console.log("Carousel API response:", response.data);
      const data = Array.isArray(response.data) ? response.data : [];
      setCarouselImages(data);
    } catch (error) {
      console.error("Error fetching active carousel images:", error);
      setCarouselImages([]);
    }
  };

  // Add carousel image
  const addCarouselImage = async (carouselData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/carousel`,
        carouselData
      );
      setCarouselImages([...carouselImages, response.data]);
      return response.data;
    } catch (error) {
      console.error("Error adding carousel image:", error.response?.data || error);
      throw error;
    }
  };

  // Delete carousel image
  const deleteCarouselImage = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/carousel/${id}`);
      setCarouselImages(carouselImages.filter((img) => img._id !== id));
    } catch (error) {
      console.error("Error deleting carousel image:", error);
      throw error;
    }
  };

  // Toggle carousel image active status
  const toggleCarouselImage = async (id, isActive) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/carousel/${id}`, {
        isActive,
      });
      setCarouselImages(
        carouselImages.map((img) =>
          img._id === id ? { ...img, isActive } : img
        )
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
        deleteCarouselImage,
        toggleCarouselImage,
      }}
    >
      {children}
    </CarouselContext.Provider>
  );
};
