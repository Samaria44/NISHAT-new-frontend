import React, { useContext, useEffect, useState } from "react";
import { FiX, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CategoryContext } from "../../Admin/context/CategoryContext";
import "./filter.css";

export default function SearchSidebar({ open, onClose, setFilteredProducts }) {
  const navigate = useNavigate();
  const { categories } = useContext(CategoryContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSub, setSelectedSub] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  // Live search in sidebar only
  useEffect(() => {
    const debounce = setTimeout(() => fetchSidebarResults(), 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, selectedCategory, selectedSub]);

  const fetchSidebarResults = async () => {
    if (!searchQuery.trim() && !selectedCategory && !selectedSub) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);

      const params = {};
      if (searchQuery.trim()) params.query = searchQuery.trim();
      if (selectedCategory) params.category = selectedCategory;
      if (selectedSub) params.subCategory = selectedSub;

      const res = await axios.get("http://localhost:8000/products", { params });
      const products = res.data.map((p) => {
        const minPrice =
          p.batches && p.batches.length > 0
            ? Math.min(...p.batches.map((b) => Number(b.price)))
            : 0;
        return {
          ...p,
          img:
            p.images && p.images.length > 0
              ? `http://localhost:8000${p.images[0]}`
              : "https://via.placeholder.com/150?text=No+Image",
          price: minPrice,
        };
      });

      setSearchResults(products); // update sidebar only
    } catch (err) {
      console.error("Sidebar search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    // Build navigation path
    let path = "/search";
    if (selectedCategory && selectedSub) path = `/category/${selectedCategory}/${selectedSub}`;
    else if (selectedCategory) path = `/category/${selectedCategory}`;
    if (searchQuery.trim()) path += `?query=${encodeURIComponent(searchQuery.trim())}`;

    // Update main grid before navigation (if function is provided)
    if (setFilteredProducts && typeof setFilteredProducts === 'function') {
      setFilteredProducts(searchResults);
    }

    navigate(path);
    onClose();
  };

  return (
    <div className={`search-sidebar ${open ? "open" : ""}`}>
      <div className="search-header">
        <h3>SEARCH OUR SITE</h3>
        <FiX className="close-icon" onClick={onClose} />
      </div>

      <div className="search-body">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FiSearch className="search-icon" />
        </div>

        <div className="filters">
          <label>Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedSub("");
            }}
          >
            <option value="">All Categories</option>
            {categories?.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          {selectedCategory &&
            categories.find((c) => c.name === selectedCategory)?.subcategories?.length > 0 && (
              <>
                <label>Subcategory</label>
                <select
                  value={selectedSub}
                  onChange={(e) => setSelectedSub(e.target.value)}
                >
                  <option value="">All Subcategories</option>
                  {categories
                    .find((c) => c.name === selectedCategory)
                    .subcategories.map((sub) => (
                      <option key={sub._id} value={sub.name}>
                        {sub.name}
                      </option>
                    ))}
                </select>
              </>
            )}
        </div>

        {loading && <p>Loading...</p>}

        {/* Sidebar live results */}
        {searchResults.length > 0 && !loading && (
          <div className="search-results">
            <p><strong>Search Results</strong></p>
            {searchResults.map((p) => (
              <div
                key={p._id}
                className="search-result-item"
                onClick={() => {
                  navigate(`/product/${p._id}`);
                  onClose();
                }}
              >
                <img src={p.img} alt={p.name} />
                <div>
                  <p>{p.name}</p>
                  <p>Rs. {p.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <button className="search-all-btn" onClick={handleSearch}>
          Search for "{searchQuery}" →
        </button>
      </div>
    </div>
  );
}
