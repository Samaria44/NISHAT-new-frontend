// D:\samaria\NISHAT\FRONTEND\my-react-app\src\Admin\Adminpages\Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Admincomponents/Admin.css";
import Slidebar from "../Admincomponents/AdminSlidebar";

export default function Admin() {
  const navigate = useNavigate();

  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  // ✅ Check authentication
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/dashboard/login");
    }
  }, [navigate]);

  // ✅ Fetch data from backend
  const loadCounts = async () => {
    try {
      const [productRes, orderRes, contactRes] = await Promise.all([
        fetch("http://localhost:8000/products"),
        fetch("http://localhost:8000/orders"),
        fetch("http://localhost:8000/contact"),
      ]);

      const products = await productRes.json();
      const orders = await orderRes.json();
      const contacts = await contactRes.json();

      setTotalProducts(products.length);
      setTotalOrders(orders.length);
      setTotalUsers(contacts.length);
    } catch (error) {
      console.error("Error loading counts:", error);
    }
  };

  // ✅ Load counts on page mount
  useEffect(() => {
    loadCounts();
  }, []);

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/dashboard/login");
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
    </div>
  );
}
