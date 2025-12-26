import React, { useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./wishlist.css";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(storedWishlist);
  }, []);

  const removeFromWishlist = (product) => {
    const updated = wishlist.filter((p) => p._id !== product._id);
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
  };

  if (wishlist.length === 0) return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Wishlist is empty</h2>;

  return (
    <div className="wishlist-page">
      <h2>My Wishlist</h2>
      <div className="wishlis-grid">
        {wishlist.map((p) => (
          <div key={p._id} className="wishlist-card" >
            <img 
              src={p.image ? `
http://localhost:8000

${p.image}` : "https://placeholder.co/150x150?text=No+Image"}
              alt={p.name}
              className="wishlist-image"
            />
            <h3>{p.name}</h3>
            <p>RS: {p.price}</p>
            <button
              className="remove-btn"
              onClick={() => removeFromWishlist(p)}
              title="Remove from wishlist"
            >
              <FiTrash2 />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
