import { useContext, useState, useEffect } from "react";
import { CarouselContext } from "../context/CarouselContext";
import { FiImage, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import "./AdminCarousel.css";

export default function AdminCarousel() {
  const {
    carouselImages,
    getCarouselImages,
    addCarouselImage,
    updateCarouselImage,
    deleteCarouselImage,
    uploadCarouselImageFile,
  } = useContext(CarouselContext);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    path: "/",
    active: true,
    displayOrder: 0,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load all carousel images on mount
  useEffect(() => {
    getCarouselImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.title.trim()) {
      alert("Title is required");
      setLoading(false);
      return;
    }

    try {
      if (editingId) {
        // Update existing
        await updateCarouselImage(editingId, formData);

        if (imageFile) {
          await uploadCarouselImageFile(editingId, imageFile);
        }
      } else {
        // Create new
        if (!imageFile) {
          alert("Image is required for new carousel slides");
          setLoading(false);
          return;
        }

        const newCarousel = await addCarouselImage(formData);

        if (imageFile && newCarousel._id) {
          await uploadCarouselImageFile(newCarousel._id, imageFile);
        }
      }

      // Reset form
      setFormData({
        title: "",
        path: "/",
        active: true,
        displayOrder: 0,
      });
      setImageFile(null);
      setImagePreview(null);
      setEditingId(null);
      setShowForm(false);
      alert(editingId ? "Carousel updated successfully!" : "Carousel created successfully!");
    } catch (error) {
      alert(error.response?.data?.error || "Error saving carousel: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (carousel) => {
    setFormData({
      title: carousel.title,
      path: carousel.path || "/",
      active: carousel.active,
      displayOrder: carousel.displayOrder,
    });
    setImagePreview(
      carousel.image ? `http://localhost:8000/${carousel.image}` : null
    );
    setImageFile(null);
    setEditingId(carousel._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this carousel slide?")) {
      try {
        await deleteCarouselImage(id);
        alert("Carousel slide deleted successfully!");
      } catch (error) {
        alert("Error deleting carousel slide");
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      path: "/",
      active: true,
      displayOrder: 0,
    });
    setImageFile(null);
    setImagePreview(null);
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="admin-carousel">
      <div className="admin-carousel-header">
        <h2>Manage Carousel Slides</h2>
        <button
          className="add-carousel-btn"
          onClick={() => setShowForm((prev) => !prev)}
        >
          {showForm ? "Cancel" : "+ Add Carousel Slide"}
        </button>
      </div>

      {showForm && (
        <form className="carousel-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Slide Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Women Collection"
              required
            />
          </div>

          <div className="form-group">
            <label>Navigation Path</label>
            <input
              type="text"
              name="path"
              value={formData.path}
              onChange={handleInputChange}
              placeholder="e.g., /category/women"
            />
            <small>Where to navigate when slide is clicked</small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Display Order</label>
              <input
                type="number"
                name="displayOrder"
                value={formData.displayOrder}
                onChange={handleInputChange}
                min="0"
              />
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleInputChange}
                />
                Active
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Slide Image *</label>
            <div className="image-upload-container">
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                  >
                    <FiX />
                  </button>
                </div>
              )}
              <label className="image-upload-label">
                <FiImage />
                <span>{imageFile ? "Change Image" : "Upload Image"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required={!editingId && !imagePreview}
                  style={{ display: "none" }}
                />
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading
                ? "Saving..."
                : editingId
                ? "Update Slide"
                : "Create Slide"}
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* TABLE VIEW */}
      <table className="carousel-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Path</th>
            <th>Order</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {carouselImages.length === 0 ? (
            <tr>
              <td colSpan="6" className="no-carousel">
                No carousel slides created yet
              </td>
            </tr>
          ) : (
            carouselImages.map((carousel) => (
              <tr key={carousel._id}>
                <td>
                  <img
                    src={
                      carousel.image
                        ? `http://localhost:8000/${carousel.image}`
                        : "https://via.placeholder.com/80x50?text=No+Image"
                    }
                    alt={carousel.title}
                    className="carousel-thumb"
                  />
                </td>
                <td>{carousel.title}</td>
                <td>{carousel.path || "/"}</td>
                <td>{carousel.displayOrder}</td>
                <td>
                  <span
                    className={`status-badge-table ${
                      carousel.active ? "active" : "inactive"
                    }`}
                  >
                    {carousel.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="carousel-action-buttons">
                  <button
                    onClick={() => handleEdit(carousel)}
                    title="Edit"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleDelete(carousel._id)}
                    title="Delete"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
