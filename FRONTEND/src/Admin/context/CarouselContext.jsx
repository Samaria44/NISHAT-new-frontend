import axios from "axios";
import { createContext, useState } from "react";

export const CarouselContext = createContext();

export const CarouselProvider = ({ children }) => {
  const [carouselImages, setCarouselImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get all carousel images (for admin)
  const getCarouselImages = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/carousel");
      setCarouselImages(response.data);
    } catch (error) {
      console.error("Error fetching carousel images:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get active carousel images (for frontend display)
  const getActiveCarouselImages = async () => {
    try {
      const response = await axios.get("http://localhost:8000/carousel/active");
      setCarouselImages(response.data);
    } catch (error) {
      console.error("Error fetching active carousel images:", error);
    }
  };

  // Add carousel image
  const addCarouselImage = async (carouselData) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/carousel",
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
      await axios.delete(`http://localhost:8000/carousel/${id}`);
      setCarouselImages(carouselImages.filter((img) => img._id !== id));
    } catch (error) {
      console.error("Error deleting carousel image:", error);
      throw error;
    }
  };

  // Toggle carousel image active status
  const toggleCarouselImage = async (id, isActive) => {
    try {
      const response = await axios.patch(`http://localhost:8000/carousel/${id}`, {
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
