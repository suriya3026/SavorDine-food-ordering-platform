import React, { useEffect, useState } from "react";
import "./Categories.css";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../../Services/categoryService";

const Categories = () => {
  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ==========================================
  // LOAD CATEGORIES
  // ==========================================

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);

      const data = await getCategories();

      console.log("Categories from backend:", data);

      setCategories(
        Array.isArray(data) ? data : []
      );

    } catch (error) {
      console.error(
        "Load Categories Error:",
        error
      );

      alert("Unable to load categories.");

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CLEAR FORM
  // ==========================================

  const clearForm = () => {
    setName("");
    setDescription("");
    setImage("");
    setEditingId(null);
  };

  // ==========================================
  // ADD / UPDATE CATEGORY
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter category name.");
      return;
    }

    try {
      setSaving(true);

      const categoryData = {
        name: name.trim(),
        description: description.trim(),
        image: image.trim(),
      };

      // UPDATE
      if (editingId) {
        const updatedCategory =
          await updateCategory(
            editingId,
            categoryData
          );

        console.log(
          "Updated Category:",
          updatedCategory
        );

        alert("Category updated successfully!");

      } else {
        // CREATE
        const newCategory =
          await createCategory(
            categoryData
          );

        console.log(
          "Created Category:",
          newCategory
        );

        alert("Category created successfully!");
      }

      clearForm();

      await loadCategories();

    } catch (error) {
      console.error(
        "Save Category Error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Unable to save category.";

      alert(message);

    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // EDIT
  // ==========================================

  const handleEdit = (category) => {
    setEditingId(category.id);

    setName(category.name || "");

    setDescription(
      category.description || ""
    );

    setImage(
      category.image || ""
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteCategory(id);

      alert("Category deleted successfully!");

      await loadCategories();

    } catch (error) {
      console.error(
        "Delete Category Error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Unable to delete category.";

      alert(message);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="categories-page">

        <div className="categories-loading">
          <h3>Loading Categories...</h3>
          <p>
            Please wait while categories
            are loaded.
          </p>
        </div>

      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="categories-page">

      {/* ======================================
          PAGE HEADER
      ====================================== */}

      <div className="categories-header">

        <div>
          <h1>Categories</h1>

          <p>
            Manage food categories
          </p>
        </div>

      </div>


      {/* ======================================
          CATEGORY FORM
      ====================================== */}

      <div className="category-form-card">

        <h2>
          {editingId
            ? "Edit Category"
            : "Add New Category"}
        </h2>

        <form onSubmit={handleSubmit}>

          {/* NAME */}

          <div className="form-group">

            <label>
              Category Name
            </label>

            <input
              type="text"
              placeholder="Example: Breakfast"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

          </div>


          {/* DESCRIPTION */}

          <div className="form-group">

            <label>
              Description
            </label>

            <textarea
              placeholder="Enter category description"
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              rows="4"
            />

          </div>


          {/* IMAGE */}

          <div className="form-group">

            <label>
              Image URL
            </label>

            <input
              type="text"
              placeholder="Enter image URL"
              value={image}
              onChange={(e) =>
                setImage(e.target.value)
              }
            />

          </div>


          {/* BUTTONS */}

          <div className="category-form-buttons">

            <button
              type="submit"
              className="save-category-btn"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Category"
                : "Add Category"}
            </button>


            {editingId && (
              <button
                type="button"
                className="cancel-category-btn"
                onClick={clearForm}
              >
                Cancel
              </button>
            )}

          </div>

        </form>

      </div>


      {/* ======================================
          CATEGORY LIST
      ====================================== */}

      <div className="categories-list-card">

        <div className="categories-list-header">

          <h2>
            All Categories
          </h2>

          <span>
            {categories.length} Categories
          </span>

        </div>


        {categories.length === 0 ? (

          <div className="no-categories">

            <h3>
              No categories found
            </h3>

            <p>
              Add your first food category
              using the form above.
            </p>

          </div>

        ) : (

          <div className="categories-grid">

            {categories.map((category) => (

              <div
                className="category-card"
                key={category.id}
              >

                {/* IMAGE */}

                <div className="category-image">

                  {category.image ? (

                    <img
                      src={category.image}
                      alt={category.name}
                      onError={(e) => {
                        e.target.style.display =
                          "none";
                      }}
                    />

                  ) : (

                    <div className="category-image-placeholder">
                      🍽️
                    </div>

                  )}

                </div>


                {/* DETAILS */}

                <div className="category-details">

                  <h3>
                    {category.name}
                  </h3>

                  <p>
                    {category.description ||
                      "No description available."}
                  </p>

                </div>


                {/* ACTIONS */}

                <div className="category-actions">

                  <button
                    type="button"
                    className="edit-category-btn"
                    onClick={() =>
                      handleEdit(category)
                    }
                  >
                    Edit
                  </button>


                  <button
                    type="button"
                    className="delete-category-btn"
                    onClick={() =>
                      handleDelete(
                        category.id
                      )
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
};

export default Categories;