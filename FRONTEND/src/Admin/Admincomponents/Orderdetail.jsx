import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./orderdetail.css";
import axiosInstance from "../../utils/axiosInterceptor";

const BACKEND_URL = (process.env.REACT_APP_BACKEND_URL || "http://localhost:8000").replace(/\/+$/, "");
const PLACEHOLDER_IMAGE = process.env.REACT_APP_PLACEHOLDER_IMAGE || "https://placeholder.co";

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axiosInstance.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };

    fetchOrder();
  }, [id]);

  if (!order) return <h2>Loading...</h2>;

  return (
    <div className="orderdetail-container">
      <h2>
        Order Details - <span>{order._id.slice(-6)}</span>
      </h2>

      <p><strong>Customer:</strong> {order.customer}</p>
      <p><strong>Email:</strong> {order.email}</p>
      <p><strong>Phone:</strong> {order.phone}</p>
      <p><strong>Date:</strong> {order.date}</p>
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Address:</strong> {order.address}</p>
      {order.city && <p><strong>City:</strong> {order.city}</p>}
      {order.postal && <p><strong>Postal Code:</strong> {order.postal}</p>}

      {order.products && order.products.length > 0 && (
        <table className="orderdetail-table">
          <thead>
            <tr>
              <th>Product Image</th>
              <th>Name</th>
              <th>Size</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {order.products.map((p, idx) => {
              // p may be of shape { product: {...}, qty, size } when populated
              const product = p.product || p; // fallback if not populated
              const qty = p.qty || p.quantity || 1;
              // prefer `product.image`, then `product.images[0]`, otherwise blank
              const imageCandidate =
                product && (product.image || (product.images && product.images[0]))
                  ? product.image || (product.images && product.images[0])
                  : "";

              const imageSrc = imageCandidate
                ? imageCandidate.startsWith("http")
                  ? imageCandidate
                  : `${BACKEND_URL}${imageCandidate}`
                : `${PLACEHOLDER_IMAGE}/60x60?text=No+Image`;
              const price = (Number(product.price) || 0) * qty;
              return (
                <tr key={idx}>
                  <td>
                    <img
                      src={imageSrc}
                      alt={product.name || "product"}
                      width={60}
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>{p.size || product.size}</td>
                  <td>{qty}</td>
                  <td>Rs {price}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
<button onClick={() => navigate(-1)} className="back-btn"> ← Back to Orders </button>
    </div>
  );
}
