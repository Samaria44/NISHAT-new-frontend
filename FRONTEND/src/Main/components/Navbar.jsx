import React, { useState, useContext, useEffect } from "react";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
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
import { useCart } from "./context/CartContext"; // Cart context

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { categories } = useContext(CategoryContext);
  const navigate = useNavigate();

  // ✅ Cart count
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((acc, item) => acc + (item.qty || 1), 0);

  // ✅ Wishlist count
  const [wishCount, setWishCount] = useState(0);

  const updateWishlistCount = () => {
    const wish = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishCount(wish.length);
  };

  useEffect(() => {
    updateWishlistCount();
    // Listen for storage events in case wishlist changes in other tabs/components
    window.addEventListener("storage", updateWishlistCount);
    return () => window.removeEventListener("storage", updateWishlistCount);
  }, []);

  // ✅ Navigation functions
  const goToCart = () => navigate("/cart");
  const goToWish = () => navigate("/wishlist");

  return (
    <header className="navbar">
      {/* Top Bar */}
      <div className="top-bar">
        <p>
          The Wait is Over — Winter Has Arrived. <a href="#">Shop Now!</a>
        </p>
      </div>

      {/* Main Navbar */}
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

        <div className="right-icons">
          <FiSearch className="icon" />

          <FiUser
            className="icon hide-mobile"
            onClick={() => navigate("/user")} // <-- Add navigation here
            style={{ cursor: "pointer" }} // optional: show pointer on hover
          />

          {/* Wishlist */}
          <div className="icon-wrapper" onClick={goToWish}>
            <FiHeart className="icon" />
            {wishCount > 0 && <span className="badge">{wishCount}</span>}
          </div>

          <FiTruck className="icon hide-mobile" />

          {/* Cart */}
          <div className="icon-wrapper" onClick={goToCart}>
            <FiShoppingCart className="icon" />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </div>
        </div>
      </div>

      {/* Desktop Menu */}
      <nav className="menu">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="menu-item"
            onClick={() => navigate(`/category/${cat.name}`)}
          >
            {cat.name}
            {cat.subcategories.length > 0 && (
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

      {/* Mobile Sidebar */}
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
              {cat.subcategories.length > 0 && (
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
          <p onClick={goToWish}>Wishlist {wishCount > 0 && `(${wishCount})`}</p>
          <p>Login / Register</p>
          <div className="contact">
            <p>Need help?</p>
            <p>042-38103311</p>
            <p>nishatonline@nishatmills.com</p>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="overlay" onClick={() => setSidebarOpen(false)}></div>
      )}
    </header>
  );
}
