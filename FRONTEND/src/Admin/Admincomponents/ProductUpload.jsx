import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./product.css";
import { FiEdit2, FiTrash2, FiX, FiImage } from "react-icons/fi";
import { CategoryContext } from "../context/CategoryContext";

const BACKEND_URL = "http://localhost:8000";

export default function ProductUpload() {
  const { categories } = useContext(CategoryContext);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  // Multiple image previews (form ke liye)
  const [previews, setPreviews] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    subCategory: "",
    size: "",
    images: [], // array of File objects when creating/updating
  });

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/products`);
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // Handle multiple images (form)
    if (name === "images" && files && files.length > 0) {
      const fileArray = Array.from(files);

      setFormData((prev) => ({
        ...prev,
        images: fileArray,
      }));

      // Make new previews from selected files
      const previewUrls = fileArray.map((file) => URL.createObjectURL(file));
      setPreviews(previewUrls);
    } else if (name === "category") {
      setFormData((prev) => ({
        ...prev,
        category: value,
        subCategory: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // 🔹 Form preview se ek image remove karne ka function
  const handleRemoveImage = (indexToRemove) => {
    setPreviews((prev) => prev.filter((_, idx) => idx !== indexToRemove));

    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  // 🔹 Table ke andar se ek single image delete karne ka function
  const handleDeleteSingleImage = async (productId, imageIndex) => {
    const confirmDelete = window.confirm("Delete this image only?");
    if (!confirmDelete) return;

    try {
      // ⚠️ Apne backend ka route yahan match karna:
      await axios.delete(
        `${BACKEND_URL}/products/${productId}/images/${imageIndex}`
      );

      // UI refresh
      fetchProducts();
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Error deleting image!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert("Name and Price are required.");
      return;
    }

    const uploadData = new FormData();

    // Non-file fields
    uploadData.append("name", formData.name);
    uploadData.append("price", formData.price);
    uploadData.append("description", formData.description);
    uploadData.append("category", formData.category);
    uploadData.append("subCategory", formData.subCategory);
    uploadData.append("size", formData.size);

    // Multiple images
    formData.images.forEach((file) => {
      uploadData.append("images", file);
    });

    try {
      if (editingProductId) {
        await axios.patch(
          `${BACKEND_URL}/products/${editingProductId}`,
          uploadData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        alert("Product updated successfully!");
      } else {
        await axios.post(`${BACKEND_URL}/products`, uploadData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Product uploaded successfully!");
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      console.error(
        "Error saving product:",
        error.response?.data || error.message
      );
      alert(
        `Error saving product: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name || "",
      price: product.price || "",
      description: product.description || "",
      category: product.category || "",
      subCategory: product.subCategory || "",
      size: product.size || "",
      images: [], // We'll select new ones if we want to update
    });

    // Existing images from backend – show as previews
    if (product.images && product.images.length > 0) {
      const serverPreviews = product.images.map(
        (imgPath) => `${BACKEND_URL}${imgPath}`
      );
      setPreviews(serverPreviews);
    } else {
      setPreviews([]);
    }

    setEditingProductId(product._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await axios.delete(`${BACKEND_URL}/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product!");
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setFormData({
      name: "",
      price: "",
      description: "",
      category: "",
      subCategory: "",
      size: "",
      images: [],
    });
    setPreviews([]);
    setEditingProductId(null);
  };

  const filteredSubcategories =
    categories.find((c) => c.name === formData.category)?.subcategories || [];

  return (
    <div className="products-page">
      <div className="products-header">
        <h2>Products ({products.length})</h2>
        <button onClick={() => setShowForm(true)}>+ Add Product</button>
      </div>

      {/* Products Table */}
      <table>
        <thead>
          <tr>
            <th>Images</th>
            <th>Name</th>
            <th>Category</th>
            <th>Subcategory</th>
            <th>Price</th>
            <th>Size</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td>
                {/* Show all images as small thumbnails WITH cross */}
                {p.images && p.images.length > 0 ? (
                  <div className="thumbs-row">
                    {p.images.map((img, index) => (
                      <div key={index} className="thumb-item">
                        <img
                          src={`${BACKEND_URL}${img}`}
                          alt={`${p.name} ${index + 1}`}
                          width={40}
                          style={{
                            marginRight: "4px",
                            borderRadius: "4px",
                            display: "block",
                          }}
                        />
                        <button
                          type="button"
                          className="thumb-remove-btn"
                          onClick={() =>
                            handleDeleteSingleImage(p._id, index)
                          }
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <FiImage />
                )}
              </td>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>{p.subCategory}</td>
              <td>{p.price}</td>
              <td>{p.size}</td>
              <td className="description-cell">{p.description}</td>
              <td className="actions">
                <FiEdit2
                  onClick={() => handleEdit(p)}
                  className="edit-icon"
                />
                <FiTrash2
                  onClick={() => handleDelete(p._id)}
                  className="delete-icon"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Popup Form */}
      {showForm && (
        <div className="popup-overlay">
          <div className="popup-form">
            <FiX className="close-btn" onClick={resetForm} />

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={formData.name}
                placeholder="Product Name"
                required
                onChange={handleChange}
              />

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <select
                name="subCategory"
                value={formData.subCategory}
                onChange={handleChange}
                required
              >
                <option value="">Select Subcategory</option>
                {filteredSubcategories.map((sub) => (
                  <option key={sub._id} value={sub.name}>
                    {sub.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                name="price"
                value={formData.price}
                placeholder="Price"
                required
                onChange={handleChange}
              />

              <input
                type="text"
                name="size"
                value={formData.size}
                placeholder="Size"
                required
                onChange={handleChange}
              />

              <textarea
                name="description"
                value={formData.description}
                placeholder="Description"
                onChange={handleChange}
              />

              {/* Multiple image input */}
              <label className="file-label">
                Product Images (you can select multiple)
              </label>
              <input
                type="file"
                name="images"
                accept="image/*"
                multiple
                onChange={handleChange}
              />

              {/* Show all previews with delete cross (form) */}
              {previews.length > 0 && (
                <div className="preview-wrapper">
                  {previews.map((src, idx) => (
                    <div key={idx} className="preview-item">
                      <img
                        src={src}
                        alt={`Preview ${idx + 1}`}
                        width={80}
                        style={{ borderRadius: "6px" }}
                      />
                      <button
                        type="button"
                        className="preview-remove-btn"
                        onClick={() => handleRemoveImage(idx)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button type="submit">
                {editingProductId ? "Update Product" : "Save Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
