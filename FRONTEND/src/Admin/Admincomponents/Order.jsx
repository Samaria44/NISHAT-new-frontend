import React, { useState, useEffect } from "react";
import "./order.css";
import { FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  // Fetch all orders
  const getOrders = async () => {
    try {
      const res = await fetch("http://localhost:8000/orders");
      const data = await res.json();
      setOrders(data);
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
      const res = await fetch(`http://localhost:8000/orders/${_id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      console.log(data.message);
      setOrders((prev) => prev.filter((o) => o._id !== _id));
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  // Update order status
  const handleStatusChange = async (_id, status) => {
    try {
      await fetch(`http://localhost:8000/orders/${_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      setOrders((prev) =>
        prev.map((order) =>
          order._id === _id ? { ...order, status } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  // Navigate to order detail
  const handleOrderClick = (_id) => {
    navigate(`/dashboard/orderdetail/${_id}`);
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
                <td>{order.date}</td>
                <td>{order.customer}</td>
                <td>{order.email}</td>
                <td>{order.phone}</td>
                <td>
                  {order.products && order.products.length > 0 && order.products[0].image ? (
                    <img
                      src={
                        order.products[0].image.startsWith("http")
                          ? order.products[0].image
                          : `http://localhost:8000${order.products[0].image}`
                      }
                      alt={order.products[0].name || "Product"}
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "6px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    "No image"
                  )}
                </td>

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
