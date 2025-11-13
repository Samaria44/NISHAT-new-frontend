// models/orderModel.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customer: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  paymentMethod: { type: String },
  // products: [
  //   {
  //     name: { type: String, required: true },
  //     price: { type: Number, required: true },
  //     qty: { type: Number, required: true },
  //     size: { type: String },
  //     image: { type: String },
  //   },
  // ],
   products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product'
      
    },
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: "Pending" },
  date: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
