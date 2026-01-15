import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineHeart } from "react-icons/ai";
import { useCart } from "../components/context/CartContext";
import "./CategoryPage.css"; 

export default function SubDetail({ product, relatedProducts }) {
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState(
    JSON.parse(localStorage.getItem("wishlist")) || []
  );

  const [showCartPopup, setShowCartPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const toggleWishlist = (product) => {
    let updatedWishlist;
    if (wishlist.find((p) => p._id === product._id)) {
      updatedWishlist = wishlist.filter((p) => p._id !== product._id);
    } else {
      updatedWishlist = [...wishlist, product];
    }
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    window.dispatchEvent(new Event("storage"));
  };

  const isInWishlist = (product) => {
    return wishlist.some((p) => p._id === product._id);
  };

  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    setSelectedProduct(product);
    setShowCartPopup(true);

    addToCart(product, 1);
  };

  const handleContinueShopping = () => {
    setShowCartPopup(false);
    setSelectedProduct(null);
  };

  const handleViewCart = () => {
    setShowCartPopup(false);
    setSelectedProduct(null);
    navigate("/cart");
  };

  return (
    <div className="category-page">
      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div>
          <h2 className="category-heading" style={{ marginTop: "50px",marginBottom: "20px", color: "#080808ff" ,marginLeft:"732px"}}>
            You May Also Like
          </h2>
          <div className="products-grid">
            {relatedProducts.map((p) => (
              <div
                key={p._id}
                className="product-card"
                onClick={() => navigate(`/product/${p._id}`)}
              >
                <div className="product-image-wrapper">
                  <img
                    src={
                      p.images && p.images.length > 0
                        ? `
http://localhost:8000

${p.images[0]}`
                        : "https://placeholder.co/150x150?text=No+Image"
                    }
                    alt={p.name}
                    className="product-image"
                  />
                  <button
                    className="image-add-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(p);
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
                <h3 className="product-name">{p.name}</h3>
                <div className="product-price-row">
                  <p className="product-price">
                    RS: {p.batches && p.batches.length > 0 
                      ? Math.min(...p.batches.map((b) => b.price || Infinity))
                      : p.price || "-"
                    }
                  </p>
                  <button
                    className="heart-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(p);
                    }}
                    style={{ color: isInWishlist(p) ? "red" : "black" }}
                  >
                    <AiOutlineHeart />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CART POPUP */}
      {showCartPopup && selectedProduct && (
        <div
          className="cart-popup-overlay"
          onClick={(e) => {
            if (e.target.classList.contains("cart-popup-overlay")) {
              handleContinueShopping();
            }
          }}
        >
          <div className="cart-popup">
            <button
              className="cart-popup-close"
              onClick={handleContinueShopping}
            >
              &times;
            </button>

            <div className="cart-popup-top">
              <img
                src={
                  selectedProduct.images && selectedProduct.images.length > 0
                    ? `
http://localhost:8000

${selectedProduct.images[0]}`
                    : "https://via.placeholder.com/150"
                }
                alt={selectedProduct.name}
                className="cart-popup-image"
              />
              <div className="cart-popup-text">
                <h4>{selectedProduct.name}</h4>
                <p>is added to your shopping cart.</p>
              </div>
            </div>

            <div className="cart-popup-buttons">
              <button
                className="cart-popup-btn secondary"
                onClick={handleContinueShopping}
              >
                Continue Shopping
              </button>
              <button
                className="cart-popup-btn primary"
                onClick={handleViewCart}
              >
                View Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
