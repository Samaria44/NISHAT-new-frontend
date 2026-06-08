import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBox, FiShoppingBag, FiMessageSquare,
  FiTrendingUp, FiAlertCircle, FiAlertTriangle
} from "react-icons/fi";
import "../Admincomponents/Admin.css";
import Slidebar from "../Admincomponents/AdminSlidebar";
import axiosInstance from "../../utils/axiosInterceptor";
import { useAuth } from "../../contexts/AuthContext";

export default function Admin() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalContacts: 0,
    topSellingCount: 0,
    outOfStockCount: 0,
    lowStockCount: 0,
  });

  const loadCounts = async () => {
    try {
      const [productRes, orderRes, contactRes] = await Promise.all([
        axiosInstance.get("/products"),
        axiosInstance.get("/orders"),
        axiosInstance.get("/contact"),
      ]);

      const products = Array.isArray(productRes.data) ? productRes.data : [];
      const orders   = Array.isArray(orderRes.data)   ? orderRes.data   : [];
      const contacts = Array.isArray(contactRes.data) ? contactRes.data : [];

      const productsWithStock = products.map((p) => {
        const totalStock = (p.batches || []).reduce((acc, b) => acc + (Number(b.stock) || 0), 0);
        return { ...p, totalStock, totalSold: Number(p.sold) || 0 };
      });

      setStats({
        totalProducts:   products.length,
        totalOrders:     orders.length,
        totalContacts:   contacts.length,
        topSellingCount: productsWithStock.filter(p => p.totalSold > 0).length,
        outOfStockCount: productsWithStock.filter(p => p.totalStock === 0).length,
        lowStockCount:   productsWithStock.filter(p => p.totalStock > 0 && p.totalStock <= 5).length,
      });
    } catch (err) {
      console.error("Error loading dashboard counts:", err);
    }
  };

  useEffect(() => { loadCounts(); }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/dashboard/login";
  };

  const adminInitial = user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || "A";

  return (
    <div className="admin-dashboard">
      <Slidebar />

      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-left">
          <h1 className="admin-title">Dashboard</h1>
          <p className="admin-subtitle">Welcome back, {user?.firstName || "Admin"}</p>
        </div>
        <div className="admin-nav">
          <div className="admin-avatar">{adminInitial}</div>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      {/* Stats Row 1 */}
      <div className="dashboard-overview">
        <div className="card product-card" onClick={() => navigate("/dashboard/products")}>
          <div className="card-icon" style={{ background: "#fff7ed", color: "#f97316" }}>
            <FiBox />
          </div>
          <h3>Total Products</h3>
          <p>{stats.totalProducts}</p>
          <span className="card-link-text">View products →</span>
        </div>

        <div className="card order-card" onClick={() => navigate("/dashboard/orders")}>
          <div className="card-icon" style={{ background: "#f0fdf4", color: "#22c55e" }}>
            <FiShoppingBag />
          </div>
          <h3>Total Orders</h3>
          <p>{stats.totalOrders}</p>
          <span className="card-link-text">View orders →</span>
        </div>

        <div className="card user-card" onClick={() => navigate("/dashboard/users")}>
          <div className="card-icon" style={{ background: "#fefce8", color: "#eab308" }}>
            <FiMessageSquare />
          </div>
          <h3>Contact Messages</h3>
          <p>{stats.totalContacts}</p>
          <span className="card-link-text">View messages →</span>
        </div>
      </div>

      {/* Stats Row 2 — Inventory */}
      <div className="dashboard-overview" style={{ paddingTop: "18px" }}>
        <div className="card top-selling-card" onClick={() => navigate("/dashboard/inventory?view=topSelling")}>
          <div className="card-icon" style={{ background: "#f0fdf4", color: "#16a34a" }}>
            <FiTrendingUp />
          </div>
          <h3>Top Selling</h3>
          <p>{stats.topSellingCount}</p>
          <span className="card-link-text">View details →</span>
        </div>

        <div className="card out-of-stock-card" onClick={() => navigate("/dashboard/inventory?view=outOfStock")}>
          <div className="card-icon" style={{ background: "#fef2f2", color: "#dc2626" }}>
            <FiAlertCircle />
          </div>
          <h3>Out of Stock</h3>
          <p>{stats.outOfStockCount}</p>
          <span className="card-link-text">View details →</span>
        </div>

        <div className="card low-stock-card" onClick={() => navigate("/dashboard/inventory?view=lowStock")}>
          <div className="card-icon" style={{ background: "#fffbeb", color: "#f59e0b" }}>
            <FiAlertTriangle />
          </div>
          <h3>Low Stock (≤5)</h3>
          <p>{stats.lowStockCount}</p>
          <span className="card-link-text">View details →</span>
        </div>
      </div>
    </div>
  );
}
