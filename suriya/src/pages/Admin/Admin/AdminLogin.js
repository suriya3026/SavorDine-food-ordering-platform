
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../Services/api";
import "./AdminLogin.css";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/admin/login", {
        username: username.trim(),
        password: password,
      });

      if (response.data.success) {
        localStorage.setItem("adminLoggedIn", "true");

        navigate("/admin/dashboard");
      } else {
        setError(
          response.data.message ||
            "Admin access is required to continue."
        );
      }
    } catch (error) {
      console.error("Admin login error:", error);

      if (error.response) {
        setError(
          error.response.data?.message ||
            "Admin access is required to continue."
        );
      } else if (error.request) {
        setError(
          "Unable to connect to the server. Please try again later."
        );
      } else {
        setError(
          "Admin login service is currently unavailable. Please try again later."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">

        {/* Header */}
        <div className="admin-login-header">
          <h1>Admin Login</h1>

          <p>
            Login to access Savor Dine Admin Dashboard
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin}>

          {/* Username */}
          <div className="admin-input-group">
            <label htmlFor="admin-username">
              Username
            </label>

            <input
              id="admin-username"
              type="text"
              placeholder="Enter admin username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          {/* Password */}
          <div className="admin-input-group">
            <label htmlFor="admin-password">
              Password
            </label>

            <input
              id="admin-password"
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="admin-login-error">
              {error}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            className="admin-login-btn"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

      </div>
    </div>
  );
};

export default AdminLogin;
