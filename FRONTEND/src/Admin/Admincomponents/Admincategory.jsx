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
  } = useContext(CategoryContext);

  const [newCategory, setNewCategory] = useState("");
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");

  const [subInputs, setSubInputs] = useState({});
  const [editSubId, setEditSubId] = useState(null);
  const [editSubName, setEditSubName] = useState({});
  const [subImages, setSubImages] = useState({});

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
         <td data-label="Category">Category</td>
<td data-label="Subcategories">Subcategories</td>
<td data-label="Add Subcategory">Add Subcategory</td>
<td data-label="Actions">Actions</td>

          </tr>
        </thead>
        <tbody>
          {categories.map((cat, idx) => (
            <tr key={cat._id}>
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
                  <div key={sub._id} className="sub-tag">
                    <img
                      src={
                        sub.image
                          ? `http://localhost:8000${sub.image}`
                          : "https://via.placeholder.com/50?text=No+Image"
                      }
                      alt={sub.name}
                      className="sub-image"
                    />
                    <input
                      type="file"
                      onChange={(e) => {
                        if (!e.target.files[0]) return;
                        updateSubcategoryImage(
                          cat._id,
                          sub._id,
                          e.target.files[0]
                        );
                      }}
                    />
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
                            setEditSubName({
                              ...editSubName,
                              [sub._id]: sub.name,
                            });
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
