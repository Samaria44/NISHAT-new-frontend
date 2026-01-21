import React, { useState, useContext } from "react";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import SearchSidebar from "./Filters.jsx"; // Make sure Filters.jsx exports default
import {
  FiSearch,
  FiUser,
  FiHeart,
  FiTruck,
  FiShoppingCart,
  FiMenu,
  FiX,
} from "react-icons/fi";

import { CategoryContext } from "../../Admin/context/CategoryContext";
import { useCart } from "./context/CartContext";
import UserSidebar from "./Login.jsx";

export default function Navbar({ onSearchClick }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loginSidebarOpen, setLoginSidebarOpen] = useState(false);
  const [searchSidebarOpen, setSearchSidebarOpen] = useState(false);

  const { categories = [] } = useContext(CategoryContext); // default empty array
  const navigate = useNavigate();

  const { cartItems = [] } = useCart(); // default empty array
  const cartCount = cartItems.reduce(
    (acc, i) => acc + (Number(i.qty || i.quantity) || 1),
    0
  );

  const wishCount = JSON.parse(localStorage.getItem("wishlist"))?.length || 0;

  return (
    <header className="navbar">
      {/* TOP BAR */}
      <div className="top-bar">
        <p>
          The Wait is Over — Winter Has Arrived. <a href="/category/winter">Shop Now!</a>
        </p>
      </div>

      {/* MAIN NAVBAR */}
      <div className="navbar-main">
        <div className="mobile-menu-icon" onClick={() => setSidebarOpen(true)}>
          <FiMenu />
        </div>

        <div className="social-icons">
          <FaFacebookF />
          <FaInstagram />
          <FaYoutube />
        </div>

        <div className="logo">nishat</div>
<div className="iconss">
        <FiSearch
          className="icon"
          onClick={() => setSearchSidebarOpen(true)}
        />

        <SearchSidebar
          open={searchSidebarOpen}
          onClose={() => setSearchSidebarOpen(false)}
        />

        <FiUser
          className="icon hide-mobile"
          onClick={() => setLoginSidebarOpen(true)}
          style={{ cursor: "pointer" }}
        />

        <div className="icon-wrapper" onClick={() => navigate("/wishlist")}>
          <FiHeart className="icon" />
          {wishCount > 0 && <span className="badge">{wishCount}</span>}
        </div>

        <FiTruck className="icon hide-mobile" />

        <div className="icon-wrapper" onClick={() => navigate("/cart")}>
          <FiShoppingCart className="icon" />
          {cartCount > 0 && <span className="badge">{cartCount}</span>}
        </div>
      </div>
</div>
      {/* DESKTOP MENU */}
      <nav className="menu">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="menu-item"
            onClick={() => navigate(`/category/${cat.name}`)}
          >
            {cat.name}
            {cat.subcategories?.length > 0 && (
              <div className="submenu">
                {cat.subcategories.map((sub) => (
                  <div
                    key={sub._id}
                    className="submenu-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/category/${cat.name}/${sub.name}`);
                    }}
                  >
                    {sub.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* MOBILE SIDEBAR */}
      <div className={`sidebar1 ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar1-header">
          <h4>MENU</h4>
          <FiX className="close-icon" onClick={() => setSidebarOpen(false)} />
        </div>
        <div className="sidebar1-links">
          {categories.map((cat) => (
            <div key={cat._id} className="mobile-menu-category">
              <p
                className="mobile-cat-title"
                onClick={() => navigate(`/category/${cat.name}`)}
              >
                {cat.name}
              </p>
              {cat.subcategories?.length > 0 && (
                <div className="mobile-sub-list">
                  {cat.subcategories.map((sub) => (
                    <p
                      key={sub._id}
                      onClick={() =>
                        navigate(`/category/${cat.name}/${sub.name}`)
                      }
                    >
                      {sub.name}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="sidebar1-footer">
          <p onClick={() => navigate("/wishlist")}>
            Wishlist {wishCount > 0 && `(${wishCount})`}
          </p>
          <p onClick={() => setLoginSidebarOpen(true)}>Login / Register</p>
          <div className="contact">
            <p>Need help?</p>
            <p>042-38103311</p>
            <p>nishatonline@nishatmills.com</p>
          </div>
        </div>
      </div>

      {/* OVERLAY */}
      {sidebarOpen && (
        <div className="overlay" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* RIGHT LOGIN SIDEBAR */}
      <UserSidebar
        open={loginSidebarOpen}
        onClose={() => setLoginSidebarOpen(false)}
      />
    </header>
  );
}
