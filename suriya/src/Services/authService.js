import api from "./api";

// ================================
// REGISTER USER
// ================================
export const registerUser = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);

    console.log("Register API Response:", response);

    return response.data;
  } catch (error) {
    console.error("Register API Error:", error);

    if (error.response) {
      throw {
        message:
          error.response.data?.message ||
          error.response.data ||
          "Registration failed",
        status: error.response.status,
      };
    }

    if (error.request) {
      throw {
        message: "Backend server is not responding",
        status: 0,
      };
    }

    throw {
      message: error.message || "Registration failed",
      status: 0,
    };
  }
};


// ================================
// LOGIN USER
// ================================
export const loginUser = async (loginData) => {
  try {
    const response = await api.post("/auth/login", loginData);

    console.log("Login API Response:", response);

    return response.data;
  } catch (error) {
    console.error("Login API Error:", error);

    if (error.response) {
      throw {
        message:
          error.response.data?.message ||
          error.response.data ||
          "Login failed",
        status: error.response.status,
      };
    }

    if (error.request) {
      throw {
        message: "Backend server is not responding",
        status: 0,
      };
    }

    throw {
      message: error.message || "Login failed",
      status: 0,
    };
  }
};