import React, { useEffect, useState } from "react";
import "./ManageFood.css";

import {
  getAllFoods,
  createFood,
  updateFood,
  deleteFood,
} from "../../../Services/foodService";

import { getAllCategories } from "../../../Services/categoryService";

const ManageFood = () => {
  // ==========================================
  // STATES
  // ==========================================

  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    available: true,
    categoryId: "",
  });

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ==========================================
  // LOAD FOODS + CATEGORIES
  // ==========================================

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [foodData, categoryData] = await Promise.all([
        getAllFoods(),
        getAllCategories(),
      ]);

      console.log("Foods:", foodData);
      console.log("Categories:", categoryData);

      // Foods
      setFoods(
        Array.isArray(foodData)
          ? foodData
          : []
      );

      // Categories
      setCategories(
        Array.isArray(categoryData)
          ? categoryData
          : []
      );

    } catch (error) {
      console.error(
        "Manage Food Load Error:",
        error
      );

      alert(
        "Unable to load food and category data."
      );

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // ==========================================
  // CLEAR FORM
  // ==========================================

  const clearForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      image: "",
      available: true,
      categoryId: "",
    });

    setEditingId(null);
  };

  // ==========================================
  // ADD / UPDATE FOOD
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Food name validation
    if (!formData.name.trim()) {
      alert("Please enter food name.");
      return;
    }

    // Price validation
    if (!formData.price) {
      alert("Please enter food price.");
      return;
    }

    // Category validation
    if (!formData.categoryId) {
      alert("Please select a category.");
      return;
    }

    try {
      setSaving(true);

      const foodData = {
        name: formData.name.trim(),

        description:
          formData.description.trim(),

        price: Number(formData.price),

        image:
          formData.image.trim(),

        available:
          formData.available,

        categoryId:
          Number(formData.categoryId),
      };

      console.log(
        "Food data sending:",
        foodData
      );

      // ========================================
      // UPDATE FOOD
      // ========================================

      if (editingId) {
        await updateFood(
          editingId,
          foodData
        );

        alert(
          "Food updated successfully!"
        );
      }

      // ========================================
      // CREATE FOOD
      // ========================================

      else {
        await createFood(foodData);

        alert(
          "Food added successfully!"
        );
      }

      clearForm();

      // Reload foods + categories
      await loadData();

    } catch (error) {
      console.error(
        "Save Food Error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.message ||
        "Unable to save food.";

      alert(message);

    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // EDIT FOOD
  // ==========================================

  const handleEdit = (food) => {
    setEditingId(food.id);

    setFormData({
      name:
        food.name || "",

      description:
        food.description || "",

      price:
        food.price !== undefined
          ? food.price
          : "",

      image:
        food.image || "",

      available:
        food.available !== false,

      categoryId:
        food.category?.id
          ? food.category.id
          : "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // DELETE FOOD
  // ==========================================

  const handleDelete = async (id) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this food?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteFood(id);

      alert(
        "Food deleted successfully!"
      );

      await loadData();

    } catch (error) {
      console.error(
        "Delete Food Error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.message ||
        "Unable to delete food.";

      alert(message);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="manage-food-page">

        <div className="manage-food-loading">

          <h3>
            Loading Food...
          </h3>

          <p>
            Please wait while food
            items and categories are loaded.
          </p>

        </div>

      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="manage-food-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="manage-food-header">

        <div>

          <h1>
            Manage Food
          </h1>

          <p>
            Add, edit and manage your
            food items
          </p>

        </div>

      </div>


      {/* ======================================
          FOOD FORM
      ====================================== */}

      <div className="manage-food-form-card">

        <h2>
          {editingId
            ? "Edit Food"
            : "Add New Food"}
        </h2>

        <form onSubmit={handleSubmit}>

          {/* FOOD NAME */}

          <div className="food-form-group">

            <label>
              Food Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Example: Chicken Biriyani"
              value={formData.name}
              onChange={handleChange}
            />

          </div>


          {/* DESCRIPTION */}

          <div className="food-form-group">

            <label>
              Description
            </label>

            <textarea
              name="description"
              placeholder="Enter food description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            />

          </div>


          {/* PRICE */}

          <div className="food-form-group">

            <label>
              Price
            </label>

            <input
              type="number"
              name="price"
              placeholder="Enter price"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
            />

          </div>


          {/* IMAGE */}

          <div className="food-form-group">

            <label>
              Image URL
            </label>

            <input
              type="text"
              name="image"
              placeholder="Enter image URL"
              value={formData.image}
              onChange={handleChange}
            />

          </div>


          {/* CATEGORY */}

          <div className="food-form-group">

            <label>
              Category
            </label>

            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
            >

              <option value="">
                Select Category
              </option>

              {categories.length > 0 ? (
                categories.map(
                  (category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  )
                )
              ) : (
                <option value="" disabled>
                  No categories available
                </option>
              )}

            </select>

          </div>


          {/* AVAILABLE */}

          <div className="food-available-group">

            <label>

              <input
                type="checkbox"
                name="available"
                checked={
                  formData.available
                }
                onChange={handleChange}
              />

              <span>
                Food Available
              </span>

            </label>

          </div>


          {/* BUTTONS */}

          <div className="food-form-buttons">

            <button
              type="submit"
              className="save-food-btn"
              disabled={saving}
            >

              {saving
                ? "Saving..."
                : editingId
                ? "Update Food"
                : "Add Food"}

            </button>


            {editingId && (

              <button
                type="button"
                className="cancel-food-btn"
                onClick={clearForm}
              >
                Cancel
              </button>

            )}

          </div>

        </form>

      </div>


      {/* ======================================
          FOOD LIST
      ====================================== */}

      <div className="food-list-card">

        <div className="food-list-header">

          <div>

            <h2>
              All Food Items
            </h2>

            <p>
              {foods.length} food item
              {foods.length !== 1
                ? "s"
                : ""}
            </p>

          </div>

        </div>


        {foods.length === 0 ? (

          <div className="no-food-items">

            <h3>
              No food items found
            </h3>

            <p>
              Add your first food item
              using the form above.
            </p>

          </div>

        ) : (

          <div className="food-admin-grid">

            {foods.map((food) => (

              <div
                className="admin-food-card"
                key={food.id}
              >

                {/* IMAGE */}

                <div className="admin-food-image">

                  {food.image ? (

                    <img
                      src={food.image}
                      alt={food.name}
                      onError={(e) => {
                        e.target.style.display =
                          "none";
                      }}
                    />

                  ) : (

                    <div className="food-image-placeholder">
                      🍽️
                    </div>

                  )}

                </div>


                {/* DETAILS */}

                <div className="admin-food-details">

                  <h3>
                    {food.name}
                  </h3>

                  <p>
                    {food.description ||
                      "No description"}
                  </p>

                  <strong>
                    ₹
                    {Number(
                      food.price || 0
                    ).toFixed(2)}
                  </strong>


                  {/* CATEGORY */}

                  <span className="food-category">

                    Category:{" "}

                    {food.category?.name ||
                      "No Category"}

                  </span>


                  {/* STATUS */}

                  <span
                    className={
                      food.available
                        ? "food-available"
                        : "food-unavailable"
                    }
                  >

                    {food.available
                      ? "Available"
                      : "Unavailable"}

                  </span>

                </div>


                {/* ACTIONS */}

                <div className="admin-food-actions">

                  <button
                    type="button"
                    className="edit-food-btn"
                    onClick={() =>
                      handleEdit(food)
                    }
                  >
                    Edit
                  </button>


                  <button
                    type="button"
                    className="delete-food-btn"
                    onClick={() =>
                      handleDelete(
                        food.id
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

export default ManageFood;