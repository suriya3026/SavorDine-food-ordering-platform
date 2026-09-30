import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

import { registerUser } from "../../Services/authService";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ========================================
  // HANDLE INPUT CHANGE
  // ========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ========================================
  // HANDLE REGISTER
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // -------------------------------
    // VALIDATION
    // -------------------------------

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("Please fill all the fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      // -------------------------------
      // DATA FOR BACKEND
      // -------------------------------

      const userData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim(),
        address: "",
      };

      console.log("Sending Register Data:", userData);

      // -------------------------------
      // API CALL
      // -------------------------------

      const response = await registerUser(userData);

      console.log("Registration Successful:", response);

      // -------------------------------
      // SUCCESS
      // -------------------------------

      alert("Registration successful!");

      // Clear form
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });

      // Go to login
      navigate("/login");

    } catch (error) {
      console.error("Registration Error:", error);

      // -------------------------------
      // ERROR MESSAGE
      // -------------------------------

      let errorMessage = "Registration failed. Please try again.";

      if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      alert(errorMessage);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      <div className="register-overlay"></div>

      <div className="register-card">

        {/* ================= HEADER ================= */}

        <div className="register-header">
          <h1>Create Account</h1>

          <p>
            Register to start ordering your favorite food
          </p>
        </div>


        {/* ================= FORM ================= */}

        <form onSubmit={handleSubmit}>

          {/* Full Name */}

          <div className="register-input-group">

            <label htmlFor="name">
              Full Name
            </label>

            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
            />

          </div>


          {/* Email */}

          <div className="register-input-group">

            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />

          </div>


          {/* Phone */}

          <div className="register-input-group">

            <label htmlFor="phone">
              Phone Number
            </label>

            <input
              id="phone"
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              autoComplete="tel"
            />

          </div>


          {/* Password */}

          <div className="register-input-group">

            <label htmlFor="password">
              Password
            </label>

            <div className="register-password-wrapper">

              <input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
              />

              <button
                type="button"
                className="register-password-toggle"
                onClick={() =>
                  setShowPassword((prev) => !prev)
                }
              >
                {showPassword ? "Hide" : "Show"}
              </button>

            </div>

          </div>


          {/* Confirm Password */}

          <div className="register-input-group">

            <label htmlFor="confirmPassword">
              Confirm Password
            </label>

            <div className="register-password-wrapper">

              <input
                id="confirmPassword"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />

              <button
                type="button"
                className="register-password-toggle"
                onClick={() =>
                  setShowConfirmPassword(
                    (prev) => !prev
                  )
                }
              >
                {showConfirmPassword
                  ? "Hide"
                  : "Show"}
              </button>

            </div>

          </div>


          {/* Terms */}

          <label className="register-terms">

            <input
              type="checkbox"
              required
            />

            <span>
              I agree to the Terms & Conditions
            </span>

          </label>


          {/* Register Button */}

          <button
            type="submit"
            className="register-btn"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>


        {/* ================= LOGIN LINK ================= */}

        <div className="login-link">

          <p>
            Already have an account?{" "}

            <Link to="/login">
              Login
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
};

export default Register;