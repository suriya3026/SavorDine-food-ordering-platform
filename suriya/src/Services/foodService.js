import api from "./api";

// ========================================
// GET ALL FOODS
// ========================================

export const getAllFoods = async () => {
  try {
    const response = await api.get("/api/foods");
    return response.data;
  } catch (error) {
    console.error(
      "Get All Foods Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ========================================
// GET FOOD BY ID
// ========================================

export const getFoodById = async (id) => {
  try {
    const response = await api.get(`/api/foods/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Get Food Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ========================================
// GET FOODS BY CATEGORY
// ========================================

export const getFoodsByCategory = async (categoryId) => {
  try {
    const response = await api.get(
      `/api/foods/category/${categoryId}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Get Foods By Category Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// ========================================
// GET AVAILABLE FOODS
// ========================================

export const getAvailableFoods = async () => {
  try {
    const response = await api.get(
      "/api/foods/available"
    );

    return response.data;
  } catch (error) {
    console.error(
      "Get Available Foods Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// ========================================
// SEARCH FOODS
// ========================================

export const searchFoods = async (name) => {
  try {
    const response = await api.get(
      `/api/foods/search?name=${encodeURIComponent(name)}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Search Foods Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// ========================================
// CREATE FOOD - ADMIN
// ========================================

export const createFood = async (foodData) => {
  try {
    const response = await api.post(
      "/api/foods",
      foodData
    );

    return response.data;
  } catch (error) {
    console.error(
      "Create Food Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// ========================================
// UPDATE FOOD - ADMIN
// ========================================

export const updateFood = async (id, foodData) => {
  try {
    const response = await api.put(
      `/api/foods/${id}`,
      foodData
    );

    return response.data;
  } catch (error) {
    console.error(
      "Update Food Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// ========================================
// DELETE FOOD - ADMIN
// ========================================

export const deleteFood = async (id) => {
  try {
    const response = await api.delete(
      `/api/foods/${id}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Delete Food Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};
