// BACKEND/src/controllers/specialSaleController.js
const path = require("path");
const fs = require("fs");
const SpecialSale = require("../models/specialSaleModel");

// Add new special sale
exports.createSpecialSale = async (req, res) => {
  try {
    const { name, discount, navigateTo } = req.body;
    const image = req.file ? `/uploads/specialsale/${req.file.filename}` : "";

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const specialSale = new SpecialSale({
      name,
      discount: Number(discount) || 0,
      navigateTo,
      image,
    });

    await specialSale.save();
    res.status(201).json(specialSale);
  } catch (err) {
    console.error("Create Special Sale Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all special sales
exports.getSpecialSales = async (req, res) => {
  try {
    const sales = await SpecialSale.find().sort({ createdAt: -1 });
    res.status(200).json(sales);
  } catch (err) {
    console.error("Get Special Sales Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update special sale — explicit field allowlist to prevent mass-assignment
exports.updateSpecialSale = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, discount, navigateTo, active, displayOrder } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (discount !== undefined) updateData.discount = Number(discount);
    if (navigateTo !== undefined) updateData.navigateTo = navigateTo;
    if (active !== undefined) updateData.active = active;
    if (displayOrder !== undefined) updateData.displayOrder = Number(displayOrder);

    if (req.file) {
      updateData.image = `/uploads/specialsale/${req.file.filename}`;

      // Delete old image file if there was one
      const existing = await SpecialSale.findById(id);
      if (existing && existing.image) {
        const oldPath = path.join(__dirname, "..", existing.image);
        fs.unlink(oldPath, (err) => {
          if (err) console.error("Failed to delete old sale image:", err.message);
        });
      }
    }

    const updated = await SpecialSale.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Special sale not found" });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error("Update Special Sale Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete special sale — also removes image from disk
exports.deleteSpecialSale = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await SpecialSale.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Special sale not found" });
    }

    // Clean up image file
    if (deleted.image) {
      const filePath = path.join(__dirname, "..", deleted.image);
      fs.unlink(filePath, (err) => {
        if (err) console.error("Failed to delete sale image:", err.message);
      });
    }

    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete Special Sale Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
