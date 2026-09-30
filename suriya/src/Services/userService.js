import api from "./api";

// ========================================
// GET ALL USERS - ADMIN
// ========================================

export const getAllUsers = async () => {
  try {
    const response = await api.get("/users");

    return response.data;
  } catch (error) {
    console.error(
      "Get All Users Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};


// ========================================
// GET USER BY ID
// ========================================

export const getUserById = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);

    return response.data;
  } catch (error) {
    console.error(
      "Get User Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};


// ========================================
// GET USER BY EMAIL
// ========================================

export const getUserByEmail = async (email) => {
  try {
    const response = await api.get(
      `/users/email/${encodeURIComponent(email)}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Get User By Email Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};


// ========================================
// CREATE USER
// ========================================

export const createUser = async (userData) => {
  try {
    const response = await api.post(
      "/users",
      userData
    );

    return response.data;
  } catch (error) {
    console.error(
      "Create User Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};


// ========================================
// UPDATE USER
// ========================================

export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(
      `/users/${id}`,
      userData
    );

    return response.data;
  } catch (error) {
    console.error(
      "Update User Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};


// ========================================
// DELETE USER - ADMIN
// ========================================

export const deleteUser = async (id) => {
  try {
    const response = await api.delete(
      `/users/${id}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Delete User Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};