// CategoryPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineHeart } from "react-icons/ai";
import "./CategoryPage.css";

export default function CategoryPage() {
  const { categoryName, subName } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCartPopup, setShowCartPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [wishlist, setWishlist] = useState(
    JSON.parse(localStorage.getItem("wishlist")) || []
  );

  useEffect(() => {
    async function fetchCategoryAndProducts() {
      try {
        setLoading(true);

        const categoryRes = await axios.get("http://localhost:8000/categories");
        const allCategories = categoryRes.data;

        const foundCategory = allCategories.find(
          (c) => c.name.toLowerCase() === categoryName.toLowerCase()
        );

        if (!foundCategory) {
          setError("Category not found");
          setCategory(null);
          setProducts([]);
          return;
        }

        setCategory(foundCategory);
        setError("");

        const productRes = await axios.get("http://localhost:8000/products");
        const allProducts = productRes.data;

        let filteredProducts = allProducts.filter(
          (p) =>
            p.category &&
            p.category.toLowerCase() === foundCategory.name.toLowerCase()
        );

        if (subName) {
          filteredProducts = filteredProducts.filter(
            (p) =>
              p.subCategory &&
              p.subCategory.toLowerCase() === subName.toLowerCase()
          );
        }

        setProducts(filteredProducts);
      } catch (err) {
        console.error(err);
        setError("Server error while fetching data");
      } finally {
        setLoading(false);
      }
    }

    fetchCategoryAndProducts();
  }, [categoryName, subName]);

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

  const handleAddToCart = (product) => {
    setSelectedProduct(product);
    setShowCartPopup(true);

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
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
      {/* CATEGORY HEADER */}
      <div className="category-header-row">
        <h2 className="category-heading">{category?.name}</h2>

        <div className="subcategory-row">
          {category?.subcategories?.map((sub) => (
            <div
              key={sub._id}
              className={`subcategory-circle ${
                subName === sub.name ? "active" : ""
              }`}
              onClick={() =>
                navigate(`/category/${category.name}/${sub.name}`)
              }
            >
              <img
                src={
                  sub.image
                    ? `http://localhost:8000${sub.image}`
                    : "https://via.placeholder.com/60?text=No+Image"
                }
                alt={sub.name}
                className="subcategory-image"
              />
              <p className="subcategory-name">{sub.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PRODUCTS GRID */}
     <div className="products-grid">
  {products.map((p) => (
    <div key={p._id} className="product-card">
      {/* 👉 image + hover button wrapper */}
      <div className="product-image-wrapper">
        <img
          src={
            p.images && p.images.length > 0
              ? `http://localhost:8000${p.images[0]}`
              : "https://via.placeholder.com/150"
          }
          alt={p.name}
          className="product-image"
          onClick={() => navigate(`/product/${p._id}`)}
        />

        {/* Ye button hover pe center me show hoga */}
        <button
          className="image-add-btn"
          onClick={(e) => {
            e.stopPropagation(); // image click navigation ko rokne ke liye
            handleAddToCart(p);
          }}
        >
          Add to Cart
        </button>
      </div>

      <h3 className="product-name">{p.name}</h3>

      <div className="product-price-row">
        <p className="product-price">RS: {p.price}</p>
        <button
          className="heart-btn"
          onClick={() => toggleWishlist(p)}
          style={{ color: isInWishlist(p) ? "red" : "black" }}
        >
          <AiOutlineHeart />
        </button>
      </div>
    </div>
  ))}
</div>


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
                  selectedProduct.images &&
                  selectedProduct.images.length > 0
                    ? `http://localhost:8000${selectedProduct.images[0]}`
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
