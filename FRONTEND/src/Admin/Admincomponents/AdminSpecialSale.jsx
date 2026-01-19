// src/Admin/components/AdminSpecialSale.jsx
import { useContext, useState, useEffect } from "react";
import { SpecialSaleContext } from "../context/SpecialSaleContext";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import "./AdminSpecialSale.css";
import axiosInstance from "../../utils/axiosInterceptor";

export default function AdminSpecialSale() {
  const {
    specialSales,
    loading,
    bannerText,
    loadingBanner,
    updateBanner,
    fetchSpecialSales,
  } = useContext(SpecialSaleContext);

  // ===== Banner State =====
  const [localBanner, setLocalBanner] = useState(bannerText || "");

  useEffect(() => {
    setLocalBanner(bannerText || "");
  }, [bannerText]);

  const handleSaveBanner = async () => {
    try {
      await updateBanner(localBanner);
      alert("Banner updated!");
    } catch (err) {
      console.error(err);
      alert("Error saving banner");
    }
  };

  // ===== Special Sale Form State =====
  const [form, setForm] = useState({
    name: "",
    discount: 0,
    navigateTo: "",
    image: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  // OPTIONAL: ensure data fresh when opening page
  useEffect(() => {
    if (!specialSales || specialSales.length === 0) {
      fetchSpecialSales && fetchSpecialSales();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setForm((prev) => ({ ...prev, image: files[0] || null }));
    } else if (name === "discount") {
      setForm((prev) => ({ ...prev, discount: Number(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      discount: 0,
      navigateTo: "",
      image: null,
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert("Name is required");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("discount", form.discount || 0);
      formData.append("navigateTo", form.navigateTo || "");
      if (form.image) {
        formData.append("image", form.image);
      }

      if (editingId) {
        await axiosInstance.put(`/specialsale/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert("Special sale updated");
      } else {
        await axiosInstance.post("/specialsale", formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert("Special sale created");
      }

      resetForm();
      fetchSpecialSales && fetchSpecialSales();
    } catch (err) {
      console.error(err);
      alert("Error saving special sale");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name || "",
      discount: item.discount || 0,
      navigateTo: item.navigateTo || "",
      image: null, // we don't preload file input
    });
    setEditingId(item._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sale?")) return;

    try {
      await axiosInstance.delete(`/specialsale/${id}`);
      alert("Special sale deleted");
      fetchSpecialSales && fetchSpecialSales();
    } catch (err) {
      console.error(err);
      alert("Error deleting special sale");
    }
  };

  return (
    <div className="sale-admin">
      {/* ========== BANNER TEXT CARD ========== */}
      <div className="banner-card">
        <div className="banner-card-header">
          <h3>Special Sale Banner Text</h3>
          {loadingBanner && <span className="banner-loading">Loading...</span>}
        </div>
        <p className="banner-help">
          This text appears on the left side of the Special Sale carousel
          (e.g. "WINTER 2025 • FLAT 50% OFF").
        </p>
        <textarea 
          className="banner-textarea"
          value={localBanner}
          onChange={(e) => setLocalBanner(e.target.value)}
          placeholder="Winter 2025, Ramzan Sale, New Arrivals..."
          rows={2}
        />
        <button
          className="banner-save-btn"
          type="button"
          onClick={handleSaveBanner}
        >
          Save Banner
        </button>
      </div>

      {/* ========== ADD / EDIT SPECIAL SALE FORM ========== */}
      <form className="sale-form" onSubmit={handleSubmit}>
        <h3 className="sale-form-title">
          {editingId ? "Edit Special Sale" : "Add Special Sale"}
        </h3>

        <div className="sale-form-grid">
          <input
            type="text"
            name="name"
            placeholder="Name (e.g. Women Kurti)"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="discount"
            placeholder="Discount %"
            value={form.discount}
            onChange={handleChange}
            min={0}
            max={100}
          />

          <input
            type="text"
            name="navigateTo"
            placeholder="Navigate URL (e.g. /category/women)"
            value={form.navigateTo}
            onChange={handleChange}
          />

          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />
        </div>

        <div className="sale-form-actions">
          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : editingId ? "Update Sale" : "Add Sale"}
          </button>
          {editingId && (
            <button
              type="button"
              className="sale-form-cancel"
              onClick={resetForm}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* ========== TABLE VIEW ========== */}
      <div className="sale-table-wrapper">
        {loading ? (
          <p>Loading special sales...</p>
        ) : specialSales.length === 0 ? (
          <p>No special sales found.</p>
        ) : (
          <table className="sale-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Discount</th>
                <th>Navigate URL</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {specialSales.map((item) => (
                <tr key={item._id}>
                  <td>
                    <img
                      src={
                        item.image
                          ? `
http://localhost:8000

${item.image}`
                          : "https://via.placeholder.com/50"
                      }
                      alt={item.name}
                      style={{ width: "50px", borderRadius: "6px" }}
                    />
                  </td>
                  <td>{item.name}</td>
                  <td>{item.discount > 0 ? item.discount + "%" : "-"}</td>
                  <td>{item.navigateTo || "/"}</td>
                  <td className="sale-table-actions">
                    <button
                      type="button"
                      className="icon-btn edit"
                      onClick={() => handleEdit(item)}
                      title="Edit"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      type="button"
                      className="icon-btn delete"
                      onClick={() => handleDelete(item._id)}
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
