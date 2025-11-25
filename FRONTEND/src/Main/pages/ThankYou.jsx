import React from "react";
import { useLocation, Link } from "react-router-dom";

export default function ThankYou() {
  const { state } = useLocation();
  const order = state?.order || {};

  return (
    <div style={{ padding: 40 }}>
      <div style={{ maxWidth: 800, margin: "0 auto", background: "#fff", padding: 24, borderRadius: 8 }}>
        <h2>Thank you — your order is placed!</h2>
        <p style={{ color: "#444" }}>Order ID: <strong>{order._id || order.id || "—"}</strong></p>
        <p>We have sent a confirmation to your email.</p>

        <h4>Summary</h4>
        <div>
          {(order.items || []).map((it, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
              <img src={it.image ? `http://localhost:8000${it.image}` : "/mnt/data/c21e9652-6d87-41cc-868a-c484bfa5713a.png"} alt={it.name} style={{ width: 60, height: 60, objectFit: "cover" }} />
              <div>
                <div>{it.name}</div>
                <div style={{ color: "#666" }}>Qty: {it.quantity || 1}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16 }}>
          <Link to="/">Continue shopping</Link>
        </div>
      </div>
    </div>
  );
}
