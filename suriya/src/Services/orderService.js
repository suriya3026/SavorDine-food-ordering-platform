import api from "./api";

// ========================================
// CREATE ORDER
// ========================================

export const createOrder = async (
  userId,
  deliveryAddress
) => {
  try {
    const response = await api.post(
      "/orders",
      {
        userId: userId,
        deliveryAddress: deliveryAddress,
      }
    );

    return response.data;

  } catch (error) {
    console.error(
      "Create Order Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};


// ========================================
// GET ALL ORDERS - ADMIN
// ========================================

export const getAllOrders = async () => {
  try {
    const response = await api.get("/orders");

    return response.data;

  } catch (error) {
    console.error(
      "Get All Orders Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};


// ========================================
// GET USER ORDERS
// ========================================

export const getOrdersByUser = async (userId) => {
  try {
    const response = await api.get(
      `/orders/user/${userId}`
    );

    return response.data;

  } catch (error) {
    console.error(
      "Get User Orders Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};


// ========================================
// GET ORDER BY ID
// ========================================

export const getOrderById = async (orderId) => {
  try {
    const response = await api.get(
      `/orders/${orderId}`
    );

    return response.data;

  } catch (error) {
    console.error(
      "Get Order Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};


// ========================================
// GET ORDER ITEMS
// ========================================

export const getOrderItems = async (orderId) => {
  try {
    const response = await api.get(
      `/orders/${orderId}/items`
    );

    return response.data;

  } catch (error) {
    console.error(
      "Get Order Items Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};


// ========================================
// UPDATE ORDER STATUS - ADMIN
// ========================================

export const updateOrderStatus = async (
  orderId,
  status
) => {
  try {
    const response = await api.put(
      `/orders/${orderId}/status?status=${encodeURIComponent(status)}`
    );

    return response.data;

  } catch (error) {
    console.error(
      "Update Order Status Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};


// ========================================
// UPDATE PAYMENT STATUS
// ========================================

export const updatePaymentStatus = async (
  orderId,
  paymentStatus
) => {
  try {
    const response = await api.put(
      `/orders/${orderId}/payment?paymentStatus=${encodeURIComponent(paymentStatus)}`
    );

    return response.data;

  } catch (error) {
    console.error(
      "Update Payment Status Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};


// ========================================
// DELETE ORDER - ADMIN
// ========================================

export const deleteOrder = async (orderId) => {
  try {
    const response = await api.delete(
      `/orders/${orderId}`
    );

    return response.data;

  } catch (error) {
    console.error(
      "Delete Order Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};