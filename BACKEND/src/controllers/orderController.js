// controllers/orderController.js
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("products.product") // YAHAN SIRF YE populate
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("Get all orders error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "products.product"
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    console.error("Get order by id error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Add new order
exports.addOrder = async (req, res) => {
  try {
    console.log(" New order received body:", JSON.stringify(req.body, null, 2));

    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();

    res
      .status(201)
      .json({ message: "Order placed successfully", order: savedOrder });
  } catch (err) {
    console.error(" Order Save Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Update order (status change)
exports.updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    // pehle purana order lao
    const existingOrder = await Order.findById(orderId);

    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    const previousStatus = existingOrder.status;

    // ab order update karo
    existingOrder.status = status || existingOrder.status;
    const updatedOrder = await existingOrder.save();

    // agar pehle Delivered nahi tha, aur ab Delivered ho gaya
    if (previousStatus !== "Delivered" && status === "Delivered") {
      // har product ke liye stock/sold update
      for (const item of existingOrder.products) {
        try {
          const prod = await Product.findById(item.product);
          if (!prod) continue;

          const qty = item.qty || 1;

          // sold increase
          prod.sold = (prod.sold || 0) + qty;

          // stock decrease (simple: first batch se minus)
          if (prod.batches && prod.batches.length > 0) {
            let remaining = qty;

            // agar multiple batches hain to sequentially reduce
            for (let b of prod.batches) {
              const available = Number(b.stock) || 0;
              if (available <= 0) continue;

              if (remaining <= available) {
                b.stock = available - remaining;
                remaining = 0;
                break;
              } else {
                b.stock = 0;
                remaining -= available;
              }
            }
          }

          await prod.save();
        } catch (e) {
          console.error("Error updating product stock for order item:", e);
        }
      }
    }

    res.json({ message: "Order updated successfully", order: updatedOrder });
  } catch (err) {
    console.error("Error updating order:", err);
    res.status(500).json({ message: err.message });
  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error("Delete order error:", err);
    res.status(500).json({ message: err.message });
  }
};
