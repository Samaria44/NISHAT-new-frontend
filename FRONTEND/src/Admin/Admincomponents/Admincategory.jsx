import React, { useContext, useState } from "react";
import { CategoryContext } from "../context/CategoryContext";
import { FiEdit, FiTrash, FiSave, FiPlus, FiImage } from "react-icons/fi";
import "./AdminCategory.css";

export default function AdminCategory() {
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    addSubcategory,
    updateSubcategory,
    deleteSubcategory,
    updateSubcategoryImage,
    updateCategoryImage,
  } = useContext(CategoryContext);

  const [newCategory, setNewCategory] = useState("");
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");

  const [subInputs, setSubInputs] = useState({});
  const [editSubId, setEditSubId] = useState(null);
  const [editSubName, setEditSubName] = useState({});

  return (
    <div className="admin-category-page">
      <h2>Manage Categories</h2>

      {/* ADD CATEGORY */}
      <div className="add-category-box">
        <input
          className="input"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Enter new category"
        />
        <button
          className="btn add"
          onClick={() => {
            if (!newCategory.trim()) return;
            addCategory(newCategory);
            setNewCategory("");
          }}
        >
          <FiPlus /> Add
        </button>
      </div>

      {/* CATEGORY TABLE */}
      <table className="category-table">
        <thead>
          <tr>
            <th>Category Image</th>
            <th>Category</th>
            <th>Subcategories</th>
            <th>Add Subcategory</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat, idx) => (
            <tr key={cat._id}>
              {/* CATEGORY IMAGE */}
              <td>
                <div className="cat-image-container">
                  <img
                    src={
                      cat.image
                        ? `https://nishat-api.vercel.app${cat.image}`
                        : "https://via.placeholder.com/80x80?text=No+Image"
                    }
                    alt={cat.name}
                    className="cat-image"
                  />
                  <label className="image-upload-label">
                    <FiImage />
                    <input
                      type="file"
                      hidden
                      onChange={(e) => {
                        if (!e.target.files[0]) return;
                        updateCategoryImage(cat._id, e.target.files[0]);
                      }}
                    />
                  </label>
                </div>
              </td>

              {/* CATEGORY NAME */}
              <td>
                {editCategoryId === cat._id ? (
                  <>
                    <input
                      className="input"
                      value={editCategoryName}
                      onChange={(e) => setEditCategoryName(e.target.value)}
                    />
                    <FiSave
                      onClick={() => {
                        updateCategory(cat._id, editCategoryName);
                        setEditCategoryId(null);
                      }}
                    />
                  </>
                ) : (
                  <span>{cat.name}</span>
                )}
              </td>

              {/* SUBCATEGORIES */}
              <td>
                {cat.subcategories.map((sub) => (
                  console.log("subcategories:", sub),
                  <div key={sub._id} className="sub-tag">
                    {/* SUBCATEGORY IMAGE */}
                    <div className="sub-image-wrapper">
                      <img
                        src={
                          sub.image
                            ? `https://nishat-api.vercel.app${sub.image}`
                            : "https://via.placeholder.com/50x50?text=No+Image"
                        }
                        alt={sub.name}
                        className="sub-image"
                      />
                      <label className="sub-image-upload">
                        <FiImage />
                        <input
                          type="file"
                          hidden
                          onChange={(e) => {
                            if (!e.target.files[0]) return;
                            updateSubcategoryImage(
                              cat._id,
                              sub._id,
                              e.target.files[0]
                            );
                          }}
                        />
                      </label>
                    </div>

                    {/* SUBCATEGORY NAME */}
                    {editSubId === sub._id ? (
                      <>
                        <input
                          className="input small"
                          value={editSubName[sub._id]}
                          onChange={(e) =>
                            setEditSubName({
                              ...editSubName,
                              [sub._id]: e.target.value,
                            })
                          }
                        />
                        <FiSave
                          onClick={() => {
                            updateSubcategory(
                              cat._id,
                              sub._id,
                              editSubName[sub._id]
                            );
                            setEditSubId(null);
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <span>{sub.name}</span>
                        <FiEdit
                          onClick={() => {
                            setEditSubId(sub._id);
                            setEditSubName({ ...editSubName, [sub._id]: sub.name });
                          }}
                        />
                        <FiTrash
                          onClick={() => deleteSubcategory(cat._id, sub._id)}
                        />
                      </>
                    )}
                  </div>
                ))}
              </td>

              {/* ADD SUBCATEGORY */}
              <td>
                <input
                  className="input small"
                  value={subInputs[idx] || ""}
                  onChange={(e) =>
                    setSubInputs({ ...subInputs, [idx]: e.target.value })
                  }
                  placeholder="Subcategory name"
                />
                <FiPlus
                  onClick={() => {
                    if (!subInputs[idx]) return;
                    addSubcategory(cat._id, subInputs[idx]);
                    setSubInputs({ ...subInputs, [idx]: "" });
                  }}
                />
              </td>

              {/* ACTIONS */}
              <td>
                {editCategoryId !== cat._id && (
                  <FiEdit
                    onClick={() => {
                      setEditCategoryId(cat._id);
                      setEditCategoryName(cat.name);
                    }}
                  />
                )}
                <FiTrash onClick={() => deleteCategory(cat._id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
