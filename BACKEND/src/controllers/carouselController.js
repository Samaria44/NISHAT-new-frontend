// NISHAT-new/BACKEND/src/controllers/carouselController.js
const CarouselService = require("../services/carousel");

// Get all carousel images
exports.getAllCarousel = async (req, res) => {
  try {
    const carousel = await CarouselService.getAllCarousel();
    res.status(200).json(carousel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get active carousel images
exports.getActiveCarousel = async (req, res) => {
  try {
    const carousel = await CarouselService.getActiveCarousel();
    res.status(200).json(carousel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create carousel image
exports.createCarousel = async (req, res) => {
  try {
    const { title, path, active, displayOrder } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ error: "Title is required" });
    }

    const carouselData = {
      title: title.trim(),
      path: path || "/",
      active: active !== undefined ? active : true,
      displayOrder: displayOrder ? Number(displayOrder) : 0,
    };

    const newCarousel = await CarouselService.createCarousel(carouselData);
    res.status(201).json(newCarousel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update carousel
exports.updateCarousel = async (req, res) => {
  try {
    const { title, path, active, displayOrder } = req.body;

    const updateData = {};
    if (title) updateData.title = title.trim();
    if (path) updateData.path = path;
    if (active !== undefined) updateData.active = active;
    if (displayOrder !== undefined)
      updateData.displayOrder = Number(displayOrder);

    const updatedCarousel = await CarouselService.updateCarousel(
      req.params.id,
      updateData
    );

    if (!updatedCarousel) {
      return res.status(404).json({ error: "Carousel item not found" });
    }

    res.status(200).json(updatedCarousel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete carousel
exports.deleteCarousel = async (req, res) => {
  try {
    const deletedCarousel = await CarouselService.deleteCarousel(req.params.id);

    if (!deletedCarousel) {
      return res.status(404).json({ error: "Carousel item not found" });
    }

    res.status(200).json({ message: "Carousel item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update carousel image
exports.updateCarouselImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    console.log("=== Carousel Image Upload Debug ===");
    console.log("File received:", req.file.filename);
    console.log("Carousel ID:", req.params.id);

    const updatedCarousel = await CarouselService.updateCarouselImage(
      req.params.id,
      req.file
    );

    console.log("Carousel updated with image:", updatedCarousel.image);

    if (!updatedCarousel) {
      return res.status(404).json({ error: "Carousel item not found" });
    }

    res.status(200).json(updatedCarousel);
  } catch (error) {
    console.error("Error updating image:", error.message);
    res.status(500).json({ error: error.message });
  }
};
