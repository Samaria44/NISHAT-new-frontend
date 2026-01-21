import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

export default function ThankYou() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [productsWithDetails, setProductsWithDetails] = useState([]);

  // Receive order safely
  const order = state?.order?.order;

  // Fetch product details
  useEffect(() => {
    if (order?.products) {
      const fetchProductDetails = async () => {
        const products = await Promise.all(
          (Array.isArray(order.products) ? order.products : []).map(async (productItem) => {
            try {
              const response = await axios.get(`${API_BASE_URL}/products/${productItem.product}`);
              const fullProduct = response.data;
              
              // Calculate price
              let productPrice = 0;
              if (fullProduct.batches && fullProduct.batches.length > 0) {
                productPrice = Math.min(...(Array.isArray(fullProduct.batches) ? fullProduct.batches : []).map((b) => b.price || Infinity));
              } else if (fullProduct.price) {
                productPrice = fullProduct.price;
              }
              
              return {
                ...productItem,
                name: fullProduct.name,
                price: productPrice
              };
            } catch (error) {
              console.error("Error fetching product:", error);
              return {
                ...productItem,
                name: "Product",
                price: 0
              };
            }
          })
        );
        setProductsWithDetails(products);
      };
      
      fetchProductDetails();
    }
  }, [order]);

  // If no order data → redirect
  if (!order) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h2>No Order Found</h2>
        <p>Please place an order first.</p>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "10px 20px",
            background: "#222",
            color: "#fff",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
          }}
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <div
        style={{
          maxWidth: 800,
          margin: "0 auto",
          background: "#fff",
          padding: 24,
          borderRadius: 8,
        }}
      >
        {/* Heading */}
        <h2> Thank you — your order is placed!</h2>

        <p style={{ color: "#444" }}>
          Order ID: <strong>{order._id || "—"}</strong>
        </p>

        {/* Order Date */}
        <p style={{ color: "#444" }}>
          Order Date: <strong>{order.date || "—"}</strong>
        </p>

        <p>
          A confirmation has been sent to:{" "}
          <strong>{order.email || "your email"}</strong>
        </p>

        {/* Delivery Address */}
        <h4>Delivery Address</h4>

        <div
          style={{
            background: "#f5f5f5",
            padding: 12,
            borderRadius: 6,
            marginBottom: 16,
          }}
        >
          <p>
            <strong>{order.customer || "—"}</strong>
          </p>

          <p>{order.address || "—"}</p>

          {order.city && <p>{order.city}</p>}
          {order.postal && <p>Postal Code: {order.postal}</p>}
          {order.phone && <p>Phone: {order.phone}</p>}
        </div>

        {/* Order Summary */}
        <h4>Order Summary</h4>

        <div>
          {(Array.isArray(productsWithDetails) ? productsWithDetails : []).map((product, i) => {
            const productPrice = product.price || 0;
            const qty = product.qty || 1;
            const itemTotal = productPrice * qty;
            const productName = product.name || "Product";

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  marginBottom: 12,
                  borderBottom: "1px solid #eee",
                  paddingBottom: 8,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{productName}</div>

                  {product.size && (
                    <div style={{ color: "#666", fontSize: 13 }}>
                      Size: {product.size}
                    </div>
                  )}

                  <div style={{ color: "#666", fontSize: 13 }}>
                    Qty: {qty}
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 600 }}>Rs {itemTotal}</div>
                  <div style={{ color: "#999", fontSize: 12 }}>
                    Rs {productPrice} × {qty}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Total + Continue */}
        <div
          style={{ marginTop: 16, paddingTop: 16, borderTop: "2px solid #eee" }}
        >
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
            Total: Rs {order.totalAmount || "—"}
          </div>

          <div style={{ fontSize: 13, color: "#666", marginBottom: 16 }}>
            Payment Method:{" "}
            {order.paymentMethod === "cod"
              ? "Cash on Delivery"
              : "Credit/Debit Card"}
          </div>

          <Link
            to="/"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              background: "#222",
              color: "#fff",
              textDecoration: "none",
              borderRadius: 6,
            }}
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
