import React, { useState, useEffect } from "react";
import "./order.css";
import { FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInterceptor";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  // Fetch all orders
  const getOrders = async () => {
    try {
      const res = await axiosInstance.get('/orders');
      const data = res.data;

      console.log("Orders API response:", data); // ek dafa console check kar lo

      // Ensure it's an array
      const normalized = Array.isArray(data) ? data : data.orders || [];
      setOrders(normalized);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  // Delete order
  const handleDelete = async (_id) => {
    if (!window.confirm("Delete this order?")) return;

    try {
      const res = await axiosInstance.delete(`/orders/${_id}`);
      console.log(res.data.message);
      setOrders((prev) => prev.filter((o) => o._id !== _id));
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  // Update order status
  const handleStatusChange = async (_id, status) => {
    try {
      await axiosInstance.patch(`/orders/${_id}`, { status });

      setOrders((prev) =>
        prev.map((order) =>
          order._id === _id ? { ...order, status } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  // Navigate to order detail page
  const handleOrderClick = (_id) => {
    navigate(`/dashboard/orderdetail/${_id}`);
  };

  // Helper to get first product image
  const renderProductImage = (order) => {
    if (!order.products || order.products.length === 0) {
      return "No image";
    }

    const firstItem = order.products[0];

    // backend se populate hua product object
    const product = firstItem.product || firstItem;

    const image =
      (product.images && product.images[0]) ||
      product.image ||
      (firstItem.images && firstItem.images[0]) ||
      firstItem.image;

    const src = image
      ? image.startsWith("http")
        ? image
        : `http://localhost:8000${image.startsWith("/") ? "" : "/"}${image}`
      : "https://placeholder.co/50x50?text=No+Image";

    return (
      <img
        src={src}
        alt={product.name || "Product"}
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "6px",
          objectFit: "cover",
        }}
      />
    );
  };

  return (
    <div className="order-table-container">
      <div className="order-header">
        <h2 className="order-title">
          User Orders <span className="count">({orders.length})</span>
        </h2>
      </div>

      <table className="order-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Customer</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Image</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center", color: "#888" }}>
                No orders yet
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order._id}>
                <td
                  className="order-id-link"
                  onClick={() => handleOrderClick(order._id)}
                >
                  {order._id.slice(-6)}
                </td>
                <td>
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString()
                    : "-"}
                </td>
                <td>{order.customer}</td>
                <td>{order.email}</td>
                <td>{order.phone}</td>
                <td>{renderProductImage(order)}</td>
                <td>
                  <select
                    value={order.status || "Pending"}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    className={`status ${order.status?.toLowerCase()}`}
                  >
                    <option>Pending</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>
                </td>
                <td>
                  <FiTrash2
                    className="delete"
                    onClick={() => handleDelete(order._id)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
