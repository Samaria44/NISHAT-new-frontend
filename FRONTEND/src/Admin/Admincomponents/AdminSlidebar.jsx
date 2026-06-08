import { NavLink } from "react-router-dom";
import {
  FiHome, FiBox, FiShoppingBag, FiUsers,
  FiGrid, FiImage, FiMail, FiMessageSquare,
  FiPackage, FiBarChart2
} from "react-icons/fi";
import "./Slidebar.css";

export default function Slidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-title">NISHAT</div>
        <div className="sidebar-subtitle">Admin Panel</div>
      </div>

      <nav>
        <ul>
          {/* Overview */}
          <p className="sidebar-section-label">Overview</p>
          <li>
            <NavLink to="/dashboard" end className={({ isActive }) => isActive ? "active" : ""}>
              <FiHome className="sidebar-icon" />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/inventory" className={({ isActive }) => isActive ? "active" : ""}>
              <FiBarChart2 className="sidebar-icon" />
              <span>Inventory</span>
            </NavLink>
          </li>

          {/* Catalog */}
          <p className="sidebar-section-label">Catalog</p>
          <li>
            <NavLink to="/dashboard/products" className={({ isActive }) => isActive ? "active" : ""}>
              <FiBox className="sidebar-icon" />
              <span>Products</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/category" className={({ isActive }) => isActive ? "active" : ""}>
              <FiGrid className="sidebar-icon" />
              <span>Categories</span>
            </NavLink>
          </li>

          {/* Sales */}
          <p className="sidebar-section-label">Sales</p>
          <li>
            <NavLink to="/dashboard/orders" className={({ isActive }) => isActive ? "active" : ""}>
              <FiShoppingBag className="sidebar-icon" />
              <span>Orders</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/specialsales" className={({ isActive }) => isActive ? "active" : ""}>
              <FiPackage className="sidebar-icon" />
              <span>Special Sales</span>
            </NavLink>
          </li>

          {/* Content */}
          <p className="sidebar-section-label">Content</p>
          <li>
            <NavLink to="/dashboard/carousel" className={({ isActive }) => isActive ? "active" : ""}>
              <FiImage className="sidebar-icon" />
              <span>Hero Carousel</span>
            </NavLink>
          </li>

          {/* Users & Messages */}
          <p className="sidebar-section-label">Users & Messages</p>
          <li>
            <NavLink to="/dashboard/admin-users" className={({ isActive }) => isActive ? "active" : ""}>
              <FiUsers className="sidebar-icon" />
              <span>Registered Users</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/newsletter" className={({ isActive }) => isActive ? "active" : ""}>
              <FiMail className="sidebar-icon" />
              <span>Newsletter</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/users" className={({ isActive }) => isActive ? "active" : ""}>
              <FiMessageSquare className="sidebar-icon" />
              <span>Contact Messages</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        © {new Date().getFullYear()} Nishat Admin
      </div>
    </aside>
  );
}
