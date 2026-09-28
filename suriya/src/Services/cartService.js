import api from "./api";

// ========================================
// GET CART ITEMS
// ========================================

export const getCartItems = async (userId) => {
  try {
    const response = await api.get(
      `/cart/${userId}`
    );

    return response.data;

  } catch (error) {
    console.error(
      "Get Cart Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};


// ========================================
// ADD FOOD TO CART
// ========================================

export const addToCart = async (
  userId,
  foodId,
  quantity
) => {
  try {
    const response = await api.post(
      "/cart/add",
      {
        userId: userId,
        foodId: foodId,
        quantity: quantity,
      }
    );

    return response.data;

  } catch (error) {
    console.error(
      "Add To Cart Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};


// ========================================
// UPDATE CART QUANTITY
// ========================================

export const updateCartQuantity = async (
  userId,
  foodId,
  quantity
) => {
  try {
    const response = await api.put(
      "/cart/update",
      {
        userId: userId,
        foodId: foodId,
        quantity: quantity,
      }
    );

    return response.data;

  } catch (error) {
    console.error(
      "Update Cart Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};


// ========================================
// REMOVE FOOD FROM CART
// ========================================

export const removeFromCart = async (
  userId,
  foodId
) => {
  try {
    const response = await api.delete(
      `/cart/remove?userId=${userId}&foodId=${foodId}`
    );

    return response.data;

  } catch (error) {
    console.error(
      "Remove Cart Item Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};


// ========================================
// CLEAR CART
// ========================================

export const clearCart = async (userId) => {
  try {
    const response = await api.delete(
      `/cart/clear/${userId}`
    );

    return response.data;

  } catch (error) {
    console.error(
      "Clear Cart Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};