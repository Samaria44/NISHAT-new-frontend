// D:\samaria\NISHAT\FRONTEND\my-react-app\src\Admin\Admincomponents\AdminSlidebar.jsx
import { NavLink } from "react-router-dom";
import { FiHome, FiBox, FiShoppingBag, FiUsers, FiGrid } from "react-icons/fi";
import "./Slidebar.css";

export default function Slidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-title">NISHAT</div>
      <div className="sidebar-subtitle">Admin Panel</div>
      <div className="sidebar-divider" />

      <ul>
        <li>
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FiHome className="sidebar-icon" />
            <span>Dashboard</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/dashboard/products"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FiBox className="sidebar-icon" />
            <span>Products</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/dashboard/category"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FiGrid className="sidebar-icon" />
            <span>Product Category</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/dashboard/orders"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FiShoppingBag className="sidebar-icon" />
            <span>Orders</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/dashboard/users"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FiUsers className="sidebar-icon" />
            <span>Users</span>
          </NavLink>
        </li>
        
         <li>
          <NavLink
            to="/dashboard/newsletter"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FiUsers className="sidebar-icon" />
            <span>Newsletter</span>
          </NavLink>
        </li>
               <li>
          <NavLink
            to="/dashboard/users-login"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FiUsers className="sidebar-icon" />
            <span>Users Login</span>
          </NavLink>
        </li>
      </ul>

      <div className="sidebar-footer">
        © {new Date().getFullYear()} Nishat Admin
      </div>
    </aside>
  );
}
