import api from "./api";

// =========================
// GET CART ITEMS
// =========================
export const getCartItems = async (userId) => {
  try {
    const response = await api.get(`/cart/${userId}`);

    console.log("Get Cart Response:", response.data);

    return response.data;
  } catch (error) {
    console.error(
      "Get Cart Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// =========================
// ADD TO CART
// =========================
export const addToCart = async (userId, foodId, quantity) => {
  try {
    const response = await api.post("/cart/add", {
      userId: Number(userId),
      foodId: Number(foodId),
      quantity: Number(quantity),
    });

    console.log("Add To Cart Response:", response.data);

    return response.data;
  } catch (error) {
    console.error(
      "Add To Cart Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// =========================
// UPDATE CART QUANTITY
// =========================
export const updateCartQuantity = async (
  userId,
  foodId,
  quantity
) => {
  try {
    const response = await api.put("/cart/update", {
      userId: Number(userId),
      foodId: Number(foodId),
      quantity: Number(quantity),
    });

    console.log(
      "Update Cart Quantity Response:",
      response.data
    );

    return response.data;
  } catch (error) {
    console.error(
      "Update Cart Quantity Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// =========================
// REMOVE SINGLE CART ITEM
// =========================
export const removeFromCart = async (
  userId,
  foodId
) => {
  try {
    const response = await api.delete(
      `/cart/remove?userId=${Number(userId)}&foodId=${Number(foodId)}`
    );

    console.log(
      "Remove Cart Item Response:",
      response.data
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

// =========================
// CLEAR ENTIRE CART
// =========================
export const clearCart = async (userId) => {
  try {
    const response = await api.delete(
      `/cart/clear/${Number(userId)}`
    );

    console.log(
      "Clear Cart Response:",
      response.data
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
