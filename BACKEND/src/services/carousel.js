// NISHAT-new/BACKEND/src/services/carousel.js
const Carousel = require("../models/carouselModel");
const path = require("path");
const fs = require("fs");

class CarouselService {
  // Get all carousel images
  static async getAllCarousel() {
    return await Carousel.find().sort({ displayOrder: 1 }).maxTimeMS(30000);
  }

  // Get active carousel images
  static async getActiveCarousel() {
    return await Carousel.find({ active: true }).sort({ displayOrder: 1 }).maxTimeMS(30000);
  }

  // Create carousel
  static async createCarousel(carouselData) {
    const carousel = new Carousel(carouselData);
    return await carousel.save({ maxTimeMS: 30000 });
  }

  // Update carousel
  static async updateCarousel(id, updateData) {
    return await Carousel.findByIdAndUpdate(id, updateData, { new: true, maxTimeMS: 30000 });
  }

  // Delete carousel
  static async deleteCarousel(id) {
    const carousel = await Carousel.findById(id).maxTimeMS(30000);
    
    if (carousel && carousel.image) {
      const imagePath = path.join(__dirname,  "../uploads", carousel.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    return await Carousel.findByIdAndDelete(id).maxTimeMS(30000);
  }

  // Update carousel image
  static async updateCarouselImage(id, file) {
    if (!file) throw new Error("No file uploaded");

    const carousel = await Carousel.findById(id).maxTimeMS(30000);
    if (!carousel) throw new Error("Carousel item not found");

    // Delete old image if exists
    if (carousel.image) {
      const oldPath = path.join(__dirname, "../uploads" ,carousel.image);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // Save new image path (NO leading slash, so easy to join)
carousel.image = `uploads/carousel/${file.filename}`;
return await carousel.save({ maxTimeMS: 30000 });

  }
}

module.exports = CarouselService;
