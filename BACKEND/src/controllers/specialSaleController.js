// BACKEND/src/controllers/specialSaleController.js
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
      discount,
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

// Update special sale
exports.updateSpecialSale = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (req.file) {
      updateData.image = `/uploads/specialsale/${req.file.filename}`;
    }

    const updated = await SpecialSale.findByIdAndUpdate(id, updateData, {
      new: true,
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

// Delete special sale
exports.deleteSpecialSale = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await SpecialSale.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Special sale not found" });
    }

    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete Special Sale Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
