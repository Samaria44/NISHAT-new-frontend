import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useCart } from "../components/context/CartContext";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import axios from "axios";
import { AiOutlineHeart, AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import "./ProductDetail.css";
import SubDetail from "./subdetail";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [wishlist, setWishlist] = useState(
    JSON.parse(localStorage.getItem("wishlist")) || []
  );
  const [quantity, setQuantity] = useState(1);
  const [descOpen, setDescOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");

  const thumbsRef = useRef(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:8000/products/${id}`);
        const prod = res.data;

        // Compute minimum price if batches exist
        if (prod.batches && prod.batches.length > 0) {
          prod.minPrice = Math.min(...prod.batches.map((b) => b.price || Infinity));
        } else {
          prod.minPrice = prod.price || "-";
        }

        setProduct(prod);

        // Fetch related products from same category
        if (prod.category) {
          const relatedRes = await axios.get(
            `http://localhost:8000/products?category=${prod.category}`
          );
          setRelatedProducts(
            relatedRes.data.filter((p) => p._id !== prod._id)
          );
        }
      } catch (err) {
        console.error(err);
        setError("Product not found or server error");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) return <div className="pd-page">Loading...</div>;
  if (error || !product) return <div className="pd-page">{error}</div>;

  const imagesArray =
    product?.images?.map((img) => `http://localhost:8000${img}`) ||
    (product?.image ? [`http://localhost:8000${product.image}`] : []);

  const isInWishlist = () =>
    wishlist.some((p) => p._id === product._id);

  const toggleWishlist = () => {
    let updatedWishlist;
    if (isInWishlist()) {
      updatedWishlist = wishlist.filter((p) => p._id !== product._id);
    } else {
      updatedWishlist = [...wishlist, product];
    }
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    window.dispatchEvent(new Event("storage"));
  };
const handleAddToCart = () => {
  if (!product) return;

  // Determine price based on selected batch/size
  let batchPrice = product.price || 0;

  if (product.batches && product.batches.length > 0) {
    if (selectedSize) {
      const selectedBatch = product.batches.find(b => b.size === selectedSize);
      batchPrice = selectedBatch ? Number(selectedBatch.price) : Number(product.batches[0].price);
    } else {
      batchPrice = Number(product.batches[0].price);
    }
  }

  // Add to cart
  addToCart({ ...product, price: batchPrice }, quantity, selectedSize);
  navigate("/cart");
};


  const prevImage = () =>
    setMainImageIndex((prev) =>
      prev === 0 ? imagesArray.length - 1 : prev - 1
    );

  const nextImage = () =>
    setMainImageIndex((prev) =>
      prev === imagesArray.length - 1 ? 0 : prev + 1
    );

  const scrollThumbs = (direction) => {
    if (!thumbsRef.current) return;
    const scrollAmount = 100;
    thumbsRef.current.scrollBy({
      top: direction === "up" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className="pd-page">
        {/* LEFT: thumbnails + main image */}
        <div className="pd-left">
          <div className="pd-thumbs-wrapper">
            <div className="pd-thumbs" ref={thumbsRef}>
              {imagesArray.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${product.name} ${idx + 1}`}
                  className={`pd-thumb-img ${
                    mainImageIndex === idx ? "active" : ""
                  }`}
                  onClick={() => setMainImageIndex(idx)}
                />
              ))}
            </div>
          </div>

          <div className="pd-main-image-wrapper">
            <img
              key={mainImageIndex}
              src={imagesArray[mainImageIndex]}
              alt={product.name}
              className="pd-main-image fade"
            />
            <button className="main-arrow left" onClick={prevImage}>
              <AiOutlineLeft />
            </button>
            <button className="main-arrow right" onClick={nextImage}>
              <AiOutlineRight />
            </button>
          </div>
        </div>

        {/* RIGHT: details */}
        <div className="pd-right">
          <h2 className="pd-title">{product.name}</h2>
          <p className="pd-price">Rs. {product.minPrice}</p>

          {/* SIZE SELECTOR */}
          {product.generalSizes && product.generalSizes.length > 1 && (
            <div className="pd-size-selector">
              <select
                className="size-selector-dropdown"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                <option value="">Select Size</option>
                {product.generalSizes.map((size, idx) => (
                  <option key={idx} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* QUANTITY + CART + WISHLIST */}
          <div className="pd-actions">
            <div className="quantity-selector">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)}>+</button>
            </div>

            <button className="pd-add-cart-btn" onClick={handleAddToCart}>
              ADD TO CART
            </button>

            <button
              className="pd-wishlist-btn"
              onClick={toggleWishlist}
              style={{ color: isInWishlist() ? "red" : "black" }}
            >
              <AiOutlineHeart />
            </button>
          </div>

          {/* DESCRIPTION */}
          <div className="pd-description-dropdown">
            <button
              onClick={() => setDescOpen(!descOpen)}
              className="desc-toggle"
            >
              Description {descOpen ? "−" : "+"}
            </button>
            {descOpen && (
              <div
                className="pd-description"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            )}
          </div>

          {/* SOCIAL SHARE */}
          <div className="pd-social-share">
            <a href="https://www.nishat.com" target="_blank" rel="noopener noreferrer" style={{ color: "#3b5998", marginRight: "10px" }}>
              <FaFacebookF size={24} style={{ cursor: "pointer" }} />
            </a>
            <a href="https://www.nishat.com" target="_blank" rel="noopener noreferrer" style={{ color: "#C13584", marginRight: "10px" }}>
              <FaInstagram size={24} style={{ cursor: "pointer" }} />
            </a>
            <a href="https://www.nishat.com" target="_blank" rel="noopener noreferrer" style={{ color: "#25D366" }}>
              <FaWhatsapp size={24} style={{ cursor: "pointer" }} />
            </a>
          </div>
        </div>
      </div>

      {/* SUBDETAIL: Related Products */}
      <SubDetail relatedProducts={relatedProducts} />
    </>
  );
}
