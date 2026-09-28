import api from "./api";

// ========================================
// GET ALL CATEGORIES
// ========================================

export const getAllCategories = async () => {
  try {
    const response = await api.get("/categories");

    return response.data;
  } catch (error) {
    console.error(
      "Get All Categories Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};


// ========================================
// GET CATEGORIES
// ========================================
// Kept for existing frontend pages
// that use getCategories()

export const getCategories = async () => {
  try {
    const response = await api.get("/categories");

    return response.data;
  } catch (error) {
    console.error(
      "Get Categories Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};


// ========================================
// GET CATEGORY BY ID
// ========================================

export const getCategoryById = async (id) => {
  try {
    const response = await api.get(
      `/categories/${id}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Get Category By ID Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};


// ========================================
// GET CATEGORY BY NAME
// ========================================

export const getCategoryByName = async (name) => {
  try {
    const response = await api.get(
      `/categories/name/${encodeURIComponent(name)}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Get Category By Name Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};


// ========================================
// CREATE CATEGORY - ADMIN
// ========================================

export const createCategory = async (categoryData) => {
  try {
    const response = await api.post(
      "/categories",
      categoryData
    );

    return response.data;
  } catch (error) {
    console.error(
      "Create Category Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};


// ========================================
// UPDATE CATEGORY - ADMIN
// ========================================

export const updateCategory = async (
  id,
  categoryData
) => {
  try {
    const response = await api.put(
      `/categories/${id}`,
      categoryData
    );

    return response.data;
  } catch (error) {
    console.error(
      "Update Category Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};


// ========================================
// DELETE CATEGORY - ADMIN
// ========================================

export const deleteCategory = async (id) => {
  try {
    const response = await api.delete(
      `/categories/${id}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Delete Category Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};