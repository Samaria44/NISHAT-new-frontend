// models/orderModel.js
const mongoose = require("mongoose");

const orderProductSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product", // product model ka naam
      required: true,
    },
    qty: { type: Number, default: 1 },
    size: { type: String },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customer: { type: String, required: true },   // frontend pe isko use karein
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    paymentMethod: { type: String },

    products: [orderProductSchema],

    totalAmount: { type: Number, required: true },
    status: { type: String, default: "Pending" },
    date: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
