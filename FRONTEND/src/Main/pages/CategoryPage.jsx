import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";
import { useCart } from "../components/context/CartContext";
import { AiOutlineHeart } from "react-icons/ai";

import SearchSidebar from "../components/Filters";
import "./CategoryPage.css";

export default function CategoryPage() {
  const { categoryName, subName } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [category, setCategory] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [wishlist, setWishlist] = useState(
    JSON.parse(localStorage.getItem("wishlist")) || []
  );

  const [showCartPopup, setShowCartPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchSidebarOpen, setSearchSidebarOpen] = useState(false);
  const [allCategories, setAllCategories] = useState([]);

  // ----------------- Fetch category and products -----------------
  useEffect(() => {
    async function fetchCategoryAndProducts() {
      try {
        setLoading(true);

        const { data: categoriesFromApi } = await axios.get(
          `${API_BASE_URL}/categories`
        );
        setAllCategories(categoriesFromApi);

        // Find main category
        const foundCategory = categoriesFromApi.find(
          (c) =>
            typeof c.name === "string" &&
            c.name.toLowerCase() === (categoryName || "").toLowerCase()
        );

        if (!foundCategory) {
          setError("Category not found");
          setCategory(null);
          setFilteredProducts([]);
          return;
        }
        setCategory(foundCategory);

        // Fetch all products
        const { data: allProducts } = await axios.get(
          `${API_BASE_URL}/products`
        );

        let categoryProducts = allProducts.filter(
          (p) =>
            typeof p.category === "string" &&
            p.category.toLowerCase() === foundCategory.name.toLowerCase()
        );

        // Filter by subcategory if provided
        if (subName) {
          categoryProducts = categoryProducts.filter(
            (p) =>
              typeof p.subCategory === "string" &&
              p.subCategory.toLowerCase() === subName.toLowerCase()
          );
        }

        // Compute minimum price for each product
        categoryProducts = categoryProducts.map((p) => {
          if (p.batches && p.batches.length > 0) {
            p.minPrice = Math.min(
              ...p.batches.map((b) =>
                b.price !== undefined && b.price !== null ? Number(b.price) : Infinity
              )
            );
          } else {
            p.minPrice = p.price || "-";
          }
          return p;
        });

        setFilteredProducts(categoryProducts);
      } catch (err) {
        console.error(err);
        setError("Server error while fetching data");
      } finally {
        setLoading(false);
      }
    }

    fetchCategoryAndProducts();
  }, [categoryName, subName]);

  // ----------------- Wishlist functions -----------------
  const toggleWishlist = (product) => {
    const updated = wishlist.some((p) => p._id === product._id)
      ? wishlist.filter((p) => p._id !== product._id)
      : [...wishlist, product];

    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
  };

  const isInWishlist = (product) => wishlist.some((p) => p._id === product._id);

  // ----------------- Cart functions -----------------
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

  if (loading) return <div className="category-page">Loading...</div>;
  if (error) return <div className="category-page">{error}</div>;

  return (
    <div className="category-page">
      {/* Category Header */}
      <div className="category-header-row">
        <h2 className="category-heading">{category?.name}</h2>
        <div className="subcategory-row">
          {category?.subcategories?.map((sub) => {
            const subNameLower = typeof sub.name === "string" ? sub.name.toLowerCase() : "";

            return (
              <div
                key={sub._id}
                className={`subcategory-circle ${subNameLower === (subName || "").toLowerCase() ? "active" : ""}`}
                onClick={() => {
                  const existsAsMainCategory = allCategories.some(
                    (c) =>
                      typeof c.name === "string" &&
                      c.name.toLowerCase() === subNameLower
                  );
                  if (existsAsMainCategory) {
                    navigate(`/category/${sub.name}`);
                  } else {
                    navigate(`/category/${category.name}/${sub.name}`);
                  }
                }}
              >
                <img
                  src={
                    sub.image
                      ? `
http://localhost:8000

${sub.image}`
                      : "https://placeholder.co/60x60?text=No+Image"
                  }
                  alt={sub.name}
                  className="subcategory-image"
                />
                <p className="subcategory-name">{sub.name}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* SEARCH SIDEBAR */}
      {searchSidebarOpen && (
        <SearchSidebar
          open={searchSidebarOpen}
          onClose={() => setSearchSidebarOpen(false)}
          setFilteredProducts={setFilteredProducts}
        />
      )}

      {/* Products Grid */}
      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p) => {
            const subCategoryLower =
              typeof p.subCategory === "string" ? p.subCategory.toLowerCase() : "";
            const isStitch = subCategoryLower === "stitch" || (p.generalSizes && p.generalSizes.length > 0);

            return (
              <div key={p._id} className="product-card">
                <div className="product-image-wrapper">
                  <img
                    src={
                      p.images?.length > 0
                        ? `
http://localhost:8000

${p.images[0]}`
                        : "https://placeholder.co/150x150?text=No+Image"
                    }
                    alt={p.name}
                    className="product-image"
                    onClick={() => navigate(`/product/${p._id}`)}
                    style={{ cursor: "pointer" }}
                  />
                  <button
                    className="image-add-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isStitch) {
                        navigate(`/product/${p._id}`);
                      } else {
                        handleAddToCart(p);
                      }
                    }}
                  >
                    {isStitch ? "View Details" : "Add to Cart"}
                  </button>
                </div>

                <div className="product-info">
                  <p
                    className="product-name"
                    onClick={() => navigate(`/product/${p._id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    {p.name}
                  </p>
                  <h4 className="product-subcategory">{p.subCategory || "-"}</h4>
                  <h4 className="product-price">RS: {p.minPrice}</h4>
                  <button
                    className="heart-btn"
                    onClick={() => toggleWishlist(p)}
                    style={{ color: isInWishlist(p) ? "red" : "black" }}
                  >
                    <AiOutlineHeart />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p>No products found.</p>
        )}
      </div>

      {/* Cart Popup */}
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
            <button className="cart-popup-close" onClick={handleContinueShopping}>
              &times;
            </button>

            <div className="cart-popup-top">
              <img
                src={
                  selectedProduct.images?.length > 0
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
              <button className="cart-popup-btn primary" onClick={handleViewCart}>
                View Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
