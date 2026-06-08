import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBox, FiShoppingBag, FiMessageSquare,
  FiTrendingUp, FiAlertCircle, FiAlertTriangle,
} from "react-icons/fi";
import axiosInstance from "../../utils/axiosInterceptor";
import "../Admincomponents/Admin.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalProducts:   0,
    totalOrders:     0,
    totalContacts:   0,
    topSellingCount: 0,
    outOfStockCount: 0,
    lowStockCount:   0,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [productRes, orderRes, contactRes] = await Promise.all([
          axiosInstance.get("/products"),
          axiosInstance.get("/orders"),
          axiosInstance.get("/contact"),
        ]);
        const products = Array.isArray(productRes.data) ? productRes.data : [];
        const orders   = Array.isArray(orderRes.data)   ? orderRes.data   : [];
        const contacts = Array.isArray(contactRes.data) ? contactRes.data : [];

        const enriched = products.map((p) => ({
          ...p,
          totalStock: (p.batches || []).reduce((a, b) => a + (Number(b.stock) || 0), 0),
          totalSold:  Number(p.sold) || 0,
        }));

        setStats({
          totalProducts:   products.length,
          totalOrders:     orders.length,
          totalContacts:   contacts.length,
          topSellingCount: enriched.filter(p => p.totalSold > 0).length,
          outOfStockCount: enriched.filter(p => p.totalStock === 0).length,
          lowStockCount:   enriched.filter(p => p.totalStock > 0 && p.totalStock <= 5).length,
        });
      } catch (err) {
        console.error("Dashboard load error:", err);
      }
    };
    load();
  }, []);

  const cards = [
    {
      label: "Total Products",
      value: stats.totalProducts,
      icon: <FiBox />,
      iconBg: "#fff7ed", iconColor: "#f97316",
      cls: "product-card",
      link: "/dashboard/products",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: <FiShoppingBag />,
      iconBg: "#f0fdf4", iconColor: "#22c55e",
      cls: "order-card",
      link: "/dashboard/orders",
    },
    {
      label: "Contact Messages",
      value: stats.totalContacts,
      icon: <FiMessageSquare />,
      iconBg: "#fefce8", iconColor: "#eab308",
      cls: "user-card",
      link: "/dashboard/users",
    },
    {
      label: "Top Selling",
      value: stats.topSellingCount,
      icon: <FiTrendingUp />,
      iconBg: "#f0fdf4", iconColor: "#16a34a",
      cls: "top-selling-card",
      link: "/dashboard/inventory",
    },
    {
      label: "Out of Stock",
      value: stats.outOfStockCount,
      icon: <FiAlertCircle />,
      iconBg: "#fef2f2", iconColor: "#dc2626",
      cls: "out-of-stock-card",
      link: "/dashboard/inventory",
    },
    {
      label: "Low Stock (≤5)",
      value: stats.lowStockCount,
      icon: <FiAlertTriangle />,
      iconBg: "#fffbeb", iconColor: "#f59e0b",
      cls: "low-stock-card",
      link: "/dashboard/inventory",
    },
  ];

  return (
    <div>
      <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 20, color: "#0f172a", margin: "0 0 24px" }}>
        Overview
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: 18,
        }}
      >
        {cards.map((c) => (
          <div
            key={c.label}
            className={`card ${c.cls}`}
            onClick={() => navigate(c.link)}
            style={{ cursor: "pointer" }}
          >
            <div
              className="card-icon"
              style={{ background: c.iconBg, color: c.iconColor }}
            >
              {c.icon}
            </div>
            <h3>{c.label}</h3>
            <p>{c.value}</p>
            <span className="card-link-text">View details →</span>
          </div>
        ))}
      </div>
    </div>
  );
}
