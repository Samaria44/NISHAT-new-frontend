import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

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

  // Update carousel image
  const updateCarouselImage = async (id, updateData) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/carousel/${id}`,
        updateData
      );
      setCarouselImages(
        carouselImages.map((img) => (img._id === id ? response.data : img))
      );
      return response.data;
    } catch (error) {
      console.error("Error updating carousel image:", error.response?.data || error);
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

  // Upload carousel image file
  const uploadCarouselImageFile = async (id, imageFile) => {
    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await axios.put(
        `http://localhost:8000/carousel/${id}/image`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Update the specific carousel item with the new image data
      setCarouselImages((prevImages) =>
        prevImages.map((img) => (img._id === id ? response.data : img))
      );
      
      return response.data;
    } catch (error) {
      console.error("Error uploading carousel image:", error.response?.data || error);
      throw error;
    }
  };

  // Load carousel images on mount
  useEffect(() => {
    getCarouselImages();
  }, []);

  return (
    <CarouselContext.Provider
      value={{
        carouselImages,
        loading,
        getCarouselImages,
        getActiveCarouselImages,
        addCarouselImage,
        updateCarouselImage,
        deleteCarouselImage,
        uploadCarouselImageFile,
      }}
    >
      {children}
    </CarouselContext.Provider>
  );
};
