// controllers/orderController.js
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
});

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("products.product") //populate
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

    console.log(" Order saved successfully:", savedOrder._id);

    // Try to send email, but don't fail the order if email fails
    try {
      // Check if email configuration is available
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log(" Email credentials not configured, skipping email");
      } else if (!savedOrder.email) {
        console.log(" Customer email not provided, skipping email");
      } else {
        // Populate product details for email
        const populatedOrderWithEmail = await Order.findById(savedOrder._id).populate("products.product");

        console.log(" Preparing email for:", populatedOrderWithEmail.email);

        //  Email Items
        const itemsHTML = populatedOrderWithEmail.products
          .map(
            (item) => `
            <li>
              <strong>${item.product?.name || 'Product'}</strong>
              <br/>Qty: ${item.qty || 1}
              ${item.size ? `<br/>Size: ${item.size}` : ""}
              <br/>Price: Rs ${item.product?.batches && item.product.batches.length > 0 
                ? Math.min(...item.product.batches.map(b => b.price))
                : item.product?.price || 0}
              <br/>Total: Rs ${((item.product?.batches && item.product.batches.length > 0 
                ? Math.min(...item.product.batches.map(b => b.price))
                : item.product?.price || 0) * (item.qty || 1))}
            </li>
          `
          )
          .join("");

        //  SEND CONFIRMATION EMAIL
        await transporter.sendMail({
          from: `"Nishat" <${process.env.EMAIL_USER}>`,
          to: populatedOrderWithEmail.email, //  customer email
          subject: `Order Confirmation - ${populatedOrderWithEmail._id}`,
          html: `
            <h2>Thank you for your order, ${populatedOrderWithEmail.customer} 💙</h2>
            <p>Your order has been successfully placed.</p>

            <h3>Order Details</h3>
            <ul>${itemsHTML}</ul>

            <p><b>Total:</b> Rs ${populatedOrderWithEmail.totalAmount}</p>
            <p><b>Payment Method:</b> ${
              populatedOrderWithEmail.paymentMethod === "cod"
                ? "Cash on Delivery"
                : "Online Payment"
            }</p>

            <h3>Delivery Address</h3>
            <p>${populatedOrderWithEmail.address}</p>
            <p>${populatedOrderWithEmail.city || ""}</p>
            <p>Phone: ${populatedOrderWithEmail.phone}</p>

            <br/>
            <p>We will contact you soon </p>
            <p><b>Nishat Team</b></p>
          `,
        });

        console.log("Email sent successfully to:", populatedOrderWithEmail.email);
      }
    } catch (emailError) {
      console.error(" Email failed but order saved:", emailError.message);
      // Don't fail the order, just log the email error
    }

    res.status(201).json({
      message: "Order placed successfully",
      order: savedOrder,
      emailSent: !!process.env.EMAIL_USER && !!process.env.EMAIL_PASS
    });

  } catch (err) {
    console.error(" Order Save Error:", err);
    res.status(500).json({ 
      message: "Failed to place order", 
      error: err.message 
    });
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
