import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./product.css";
import { FiEdit2, FiTrash2, FiX, FiImage } from "react-icons/fi";
import { CategoryContext } from "../context/CategoryContext";
import { API_BASE_URL } from "../../../config/api";

const BACKEND_URL = API_BASE_URL;
const ALL_SIZES = ["S", "M", "L", "XL"];

export default function ProductUpload() {
  const { categories } = useContext(CategoryContext);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [previews, setPreviews] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    subCategory: "",
    size: [], // ✅ product-level sizes
    images: [],
    batches: [
      { batchName: "Batch 1", price: "", stock: "" }, // no size per batch
    ],
  });

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

  // ================= Handle Inputs =================
  const handleChange = (e, batchIndex = null, field = null) => {
    const { name, value, files, options } = e.target;

    // Images
    if (name === "images" && files && files.length > 0) {
      const fileArray = Array.from(files);
      setFormData((prev) => ({ ...prev, images: fileArray }));
      const previewUrls = fileArray.map((file) => URL.createObjectURL(file));
      setPreviews(previewUrls);
      return;
    }

    // Batches
    if (batchIndex !== null && field) {
      setFormData((prev) => {
        const newBatches = [...prev.batches];
        newBatches[batchIndex][field] = value;
        return { ...prev, batches: newBatches };
      });
      return;
    }

    // Size multi-select
    if (name === "size") {
      const selected = Array.from(options)
        .filter((opt) => opt.selected)
        .map((opt) => opt.value);

      setFormData((prev) => ({ ...prev, size: selected }));
      return;
    }

    // Category change resets subcategory
    if (name === "category") {
      setFormData((prev) => ({ ...prev, category: value, subCategory: "" }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ================= Batch Management =================
  const addBatch = () => {
    setFormData((prev) => ({
      ...prev,
      batches: [
        ...prev.batches,
        { batchName: `Batch ${prev.batches.length + 1}`, price: "", stock: "" },
      ],
    }));
  };

  const removeBatch = (index) => {
    setFormData((prev) => ({
      ...prev,
      batches: prev.batches.filter((_, i) => i !== index),
    }));
  };

  // ================= Image Handlers =================
  const handleRemoveImage = (indexToRemove) => {
    setPreviews((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleDeleteSingleImage = async (productId, imageIndex) => {
    if (!window.confirm("Delete this image only?")) return;
    try {
      await axios.delete(
        `${BACKEND_URL}/products/${productId}/images/${imageIndex}`
      );
      fetchProducts();
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Error deleting image!");
    }
  };

  // ================= Submit =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || formData.batches.length === 0) {
      alert("Product name and at least one batch required.");
      return;
    }

    // if (formData.size.length === 0) {
    //   alert("Please select at least one size.");
    //   return;
    // }

    const uploadData = new FormData();
    uploadData.append("name", formData.name);
    uploadData.append("description", formData.description);
    uploadData.append("category", formData.category);
    uploadData.append("subCategory", formData.subCategory);

    uploadData.append("size", JSON.stringify(formData.size)); // product-level sizes

    formData.images.forEach((file) => uploadData.append("images", file));
    uploadData.append("batches", JSON.stringify(formData.batches));

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

  // ================= Edit / Delete / Reset =================
  const handleEdit = (product) => {
    setFormData({
      name: product.name || "",
      description: product.description || "",
      category: product.category || "",
      subCategory: product.subCategory || "",
      size: product.generalSizes || [],
      images: [],
      batches:
        product.batches && product.batches.length > 0
          ? product.batches.map((b) => ({ ...b }))
          : [{ batchName: "Batch 1", price: "", stock: "" }],
    });

    if (product.images && product.images.length > 0) {
      const serverPreviews = product.images.map(
        (img) => `${BACKEND_URL}${img}`
      );
      setPreviews(serverPreviews);
    } else setPreviews([]);

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
      description: "",
      category: "",
      subCategory: "",
      size: [],
      images: [],
      batches: [{ batchName: "Batch 1", price: "", stock: "" }],
    });
    setPreviews([]);
    setEditingProductId(null);
  };

  const filteredSubcategories =
    categories.find((c) => c.name === formData.category)?.subcategories || [];

  // ================= Render =================
  return (
    <div className="products-page">
      <div className="products-header">
        <h2>Products ({products.length})</h2>
        <button onClick={() => setShowForm(true)}>+ Add Product</button>
      </div>

      {/* Table */}
      {/* Table */}
      <table className="admin-products-table">
        <thead>
          <tr>
            <th>Images</th>
            <th>Name</th>
            <th>Category</th>
            <th>Subcategory</th>
            <th>Sizes</th>
            <th>Batches / Variants</th>
            <th>Price</th> {/* ✅ Added Price column */}
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => {
            // Compute minimum price if batches exist
            const minPrice =
              p.batches && p.batches.length > 0
                ? Math.min(...p.batches.map((b) => Number(b.price) || Infinity))
                : p.price || "-";

            return (
              <tr key={p._id}>
                <td>
                  {p.images && p.images.length > 0 ? (
                    <div className="thumbs-row">
                      {p.images.map((img, index) => (
                        <div key={index} className="thumb-item">
                          <img src={`${BACKEND_URL}${img}`} alt="" width={40} />
                          <button
                            className="pro-btn"
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
                <td>
                  {p.generalSizes && p.generalSizes.length > 0
                    ? p.generalSizes.join(", ")
                    : "—"}
                </td>
                <td>
                  {p.batches && p.batches.length > 0 ? (
                    <ul>
                      {p.batches.map((b, idx) => (
                        <li key={idx}>
                          {b.batchName} — {b.stock} pcs @ Rs {b.price}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "No batches"
                  )}
                </td>
                <td>Rs {minPrice}</td> {/* ✅ Display min price */}
                <td>{p.description}</td>
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
            );
          })}
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
                onChange={handleChange}
                required
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
                // required
              >
                <option value="">Select Subcategory</option>
                {filteredSubcategories.map((sub) => (
                  <option key={sub._id} value={sub.name}>
                    {sub.name}
                  </option>
                ))}
              </select>

              <label>Sizes</label>
              <div className="sizes-checkbox">
                {ALL_SIZES.map((s) => (
                  <label key={s}>
                    <input
                      type="checkbox"
                      checked={formData.size.includes(s)}
                      onChange={() => {
                        setFormData((prev) => {
                          const newSizes = prev.size.includes(s)
                            ? prev.size.filter((item) => item !== s)
                            : [...prev.size, s];
                          return { ...prev, size: newSizes };
                        });
                      }}
                    />
                    {s}
                  </label>
                ))}
              </div>

              <textarea
                name="description"
                value={formData.description}
                placeholder="Description (Supports HTML)"
                onChange={handleChange}
                rows={6}
                style={{ whiteSpace: "pre-wrap" }}
              />

              <label>Product Images</label>
              <input
                type="file"
                name="images"
                accept="image/*"
                multiple
                onChange={handleChange}
              />

              {previews.length > 0 && (
                <div className="preview-wrapper">
                  {previews.map((src, idx) => (
                    <div key={idx} className="preview-item">
                      <img src={src} alt="" width={80} />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="batch-section">
                <h4>Batches / Variants</h4>
                {formData.batches.map((batch, idx) => (
                  <div key={idx} className="batch-row">
                    <input
                      type="text"
                      placeholder="Batch Name"
                      value={batch.batchName}
                      onChange={(e) => handleChange(e, idx, "batchName")}
                      required
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={batch.price}
                      onChange={(e) => handleChange(e, idx, "price")}
                      required
                    />
                    <input
                      type="number"
                      placeholder="Stock"
                      value={batch.stock}
                      onChange={(e) => handleChange(e, idx, "stock")}
                      required
                    />
                    {idx > 0 && (
                      <button type="button" onClick={() => removeBatch(idx)}>
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addBatch}>
                  + Add Batch
                </button>
              </div>

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
