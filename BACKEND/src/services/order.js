const Order = require('../models/Order');

// Create a new order
const createOrder = async (orderData) => {
    return await Order.create(orderData);
};

// Get all orders
const getOrders = async () => {
    return await Order.find().populate("products.productId");
};

// Get order by ID
const getOrderById = async (id) => {
    return await Order.findById(id).populate("products.productId");
};

// Update an order
const updateOrder = async (id, orderData) => {
    return await Order.findByIdAndUpdate(id, orderData, { new: true });
};

// Delete an order
const deleteOrder = async (id) => {
    return await Order.findByIdAndDelete(id);
};

module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder
};
