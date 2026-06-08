import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Slidebar from "./AdminSlidebar";
import { useAuth } from "../../contexts/AuthContext";
import "./Admin.css";

// Map route paths → human-readable page titles
const PAGE_TITLES = {
  "/dashboard":            "Dashboard",
  "/dashboard/products":   "Products",
  "/dashboard/category":   "Categories",
  "/dashboard/orders":     "Orders",
  "/dashboard/orderdetail":"Order Detail",
  "/dashboard/specialsales":"Special Sales",
  "/dashboard/carousel":   "Hero Carousel",
  "/dashboard/newsletter": "Newsletter",
  "/dashboard/users":      "Contact Messages",
  "/dashboard/admin-users":"Registered Users",
  "/dashboard/inventory":  "Inventory",
};

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/dashboard/login", { replace: true });
  };

  // Find the best matching title
  const title = Object.entries(PAGE_TITLES)
    .filter(([path]) => location.pathname.startsWith(path))
    .sort((a, b) => b[0].length - a[0].length)[0]?.[1] || "Admin";

  const initial = user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || "A";

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f1f5f9", fontFamily: "'Poppins',sans-serif" }}>
      <Slidebar />

      {/* Fixed top header */}
      <header className="admin-header">
        <div className="admin-header-left">
          <h1 className="admin-title">{title}</h1>
          <p className="admin-subtitle">Welcome, {user?.firstName || "Admin"}</p>
        </div>
        <div className="admin-nav">
          <div className="admin-avatar">{initial}</div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {/* Page content */}
      <main style={{
        marginLeft: 240,
        flex: 1,
        padding: "88px 28px 40px",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}>
        <Outlet />
      </main>
    </div>
  );
}
