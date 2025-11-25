import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineHeart } from "react-icons/ai";
import "./CategoryPage.css"; 

export default function SubDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [wishlist, setWishlist] = useState(
    JSON.parse(localStorage.getItem("wishlist")) || []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCartPopup, setShowCartPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    async function fetchProductAndRelated() {
      try {
        setLoading(true);
        // Fetch product details
        const productRes = await axios.get(`http://localhost:8000/products/${id}`);
        const currentProduct = productRes.data;
        setProduct(currentProduct);

        // Fetch related products from same category
        if (currentProduct.category) {
          const allProductsRes = await axios.get("http://localhost:8000/products");
          const allProducts = allProductsRes.data;

          const filteredProducts = allProducts
            .filter(
              (p) =>
                p.category &&
                p.category.toLowerCase() === currentProduct.category.toLowerCase() &&
                p._id !== currentProduct._id // exclude current product
            );

          setRelatedProducts(filteredProducts);
        }
      } catch (err) {
        console.error(err);
        setError("Server error while fetching product");
      } finally {
        setLoading(false);
      }
    }

    fetchProductAndRelated();
  }, [id]);

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
  if (!product) return <div className="category-page">Product not found</div>;

  return (
    <div className="category-page">
      {/* Product Header */}
      

      {/* Product Details */}
   
      {/* Related Products */}
      {relatedProducts.length > 0 && (
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
                        ? `http://localhost:8000${p.images[0]}`
                        : "https://via.placeholder.com/150"
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
                  <p className="product-price">RS: {p.price}</p>
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
