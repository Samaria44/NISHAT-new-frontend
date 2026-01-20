// D:\samaria\NISHAT\FRONTEND\my-react-app\src\Admin\Adminpages\Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import "../Admincomponents/chart"
// import { BarChart } from '@mui/x-charts/BarChart';
// import { dataset, valueFormatter } from '../dataset/weather';

import "../Admincomponents/Admin.css";
import Slidebar from "../Admincomponents/AdminSlidebar";
import BasicBars from "../Admincomponents/chart";
import axiosInstance from "../../utils/axiosInterceptor";
import { useAuth } from "../../contexts/AuthContext";

export default function Admin() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  // 🔹 New states for inventory summary
  const [topSellingCount, setTopSellingCount] = useState(0);
  const [outOfStockCount, setOutOfStockCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);

  // ✅ Fetch data from backend (counts + inventory summary)
  const loadCounts = async () => {
    try {
      const [productRes, orderRes, contactRes] = await Promise.all([
        axiosInstance.get('/products'),
        axiosInstance.get('/orders'),
        axiosInstance.get('/contact'),
      ]);

      const products = productRes.data;
      const orders = orderRes.data;
      const contacts = contactRes.data;

      // Ensure we have arrays, fallback to empty arrays if not
      const productsArray = Array.isArray(products) ? products : [];
      const ordersArray = Array.isArray(orders) ? orders : [];
      const contactsArray = Array.isArray(contacts) ? contacts : [];

      setTotalProducts(productsArray.length);
      setTotalOrders(ordersArray.length);
      setTotalUsers(contactsArray.length);

      // 🔹 INVENTORY LOGIC
      const productsWithStock = productsArray.map((p) => {
        const totalStock = (p.batches || []).reduce(
          (acc, b) => acc + (Number(b.stock) || 0),
          0
        );
        const totalSold = Number(p.sold) || 0;

        return { ...p, totalStock, totalSold };
      });

      //  Top-selling: sold > 0
      const topSelling = productsWithStock.filter((p) => p.totalSold > 0);
      setTopSellingCount(topSelling.length);

      //  Out of stock: stock === 0
      const outOfStock = productsWithStock.filter((p) => p.totalStock === 0);
      setOutOfStockCount(outOfStock.length);

      //  Low stock: 1–5
      const lowStock = productsWithStock.filter(
        (p) => p.totalStock > 0 && p.totalStock <= 5
      );
      setLowStockCount(lowStock.length);
    } catch (error) {
      console.error("Error loading counts:", error);
      // Set fallback values to prevent UI crashes
      setTotalProducts(0);
      setTotalOrders(0);
      setTotalUsers(0);
      setTopSellingCount(0);
      setOutOfStockCount(0);
      setLowStockCount(0);
    }
  };

  // ✅ Load counts on page mount
  useEffect(() => {
    loadCounts();
  }, []);

  // ✅ Logout function
  const handleLogout = async () => {
    console.log('Logout button clicked');
    try {
      console.log('Calling AuthContext logout...');
      await logout(); // Use AuthContext logout function
      console.log('AuthContext logout completed, redirecting to /dashboard/login');
      window.location.href = '/dashboard/login';
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback: clear localStorage manually and redirect
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      console.log('Fallback: redirecting to /dashboard/login');
      window.location.href = '/dashboard/login';
    }
  };

  // 🔹 Navigate helpers for cards
  const goToTopSelling = () => {
    navigate("/dashboard/inventory?view=topSelling");
  };

  const goToOutOfStock = () => {
    navigate("/dashboard/inventory?view=outOfStock");
  };

  const goToLowStock = () => {
    navigate("/dashboard/inventory?view=lowStock");
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <Slidebar />

      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-left">
          <h1 className="admin-title">Admin Dashboard</h1>
        </div>

        <nav className="admin-nav">
          <div className="admin-avatar">S</div>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </nav>
      </header>

      {/* Dashboard Summary Cards */}
      <div className="dashboard-overview">
        <div className="card product-card">
          <h3>Total Products</h3>
          <p>{totalProducts}</p>
        </div>

        <div className="card order-card">
          <h3>Total Orders</h3>
          <p>{totalOrders}</p>
        </div>

        <div className="card user-card">
          <h3>Registered Users</h3>
          <p>{totalUsers}</p>
        </div>
      </div>


      {/* 🔹 Inventory Summary (3 Clickable Sub-Cards) */}
      <div className="dashboard-overview">
        <div className="card top-selling-card" onClick={goToTopSelling}>
          <h3>Top Selling Products</h3>
          <p>{topSellingCount}</p>
          <span className="card-link-text">View details →</span>
        </div>

        <div className="card out-of-stock-card" onClick={goToOutOfStock}>
          <h3>Out of Stock</h3>
          <p>{outOfStockCount}</p>
          <span className="card-link-text">View details →</span>
        </div>

        <div className="card low-stock-card" onClick={goToLowStock}>
          <h3>Low Stock (≤ 5)</h3>
          <p>{lowStockCount}</p>
          <span className="card-link-text">View details →</span>
        </div>
      </div>
      {/* <BasicBars/> */}
    </div>
  );
}
