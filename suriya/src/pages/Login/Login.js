import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

import { loginUser } from "../../Services/authService";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // =========================================
  // LOGIN
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // =========================================
    // VALIDATION
    // =========================================

    if (!email.trim() || !password) {
      alert("Please enter your email and password");
      return;
    }

    try {
      setLoading(true);

      // =========================================
      // LOGIN DATA
      // =========================================

      const loginData = {
        email: email.trim(),
        password: password,
      };

      console.log("Login Data:", loginData);

      // =========================================
      // BACKEND LOGIN
      // =========================================

      const response = await loginUser(loginData);

      console.log("Login Response:", response);

      // =========================================
      // SAVE USER INFORMATION
      // =========================================

      if (response) {
        localStorage.setItem(
          "user",
          JSON.stringify(response)
        );

        localStorage.setItem(
          "isLoggedIn",
          "true"
        );

        // Save user ID separately
        if (response.id) {
          localStorage.setItem(
            "userId",
            response.id.toString()
          );
        }

        // Save role
        if (response.role) {
          localStorage.setItem(
            "role",
            response.role
          );
        }
      }

      // =========================================
      // SUCCESS
      // =========================================

      alert("Login successful!");

      navigate("/");

    } catch (error) {
      console.error("Login Error:", error);

      let errorMessage =
        "Login failed. Please check your email and password.";

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

  // =========================================
  // JSX
  // =========================================

  return (
    <div className="login-page">

      <div className="login-overlay"></div>

      <div className="login-card">

        {/* =================================
            HEADER
        ================================= */}

        <div className="login-header">

          <h1>
            Welcome Back
          </h1>

          <p>
            Login to your account
          </p>

        </div>


        {/* =================================
            LOGIN FORM
        ================================= */}

        <form onSubmit={handleSubmit}>

          {/* EMAIL */}

          <div className="login-input-group">

            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              autoComplete="email"
            />

          </div>


          {/* PASSWORD */}

          <div className="login-input-group">

            <label htmlFor="password">
              Password
            </label>

            <div className="login-password-wrapper">

              <input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                autoComplete="current-password"
              />

              <button
                type="button"
                className="login-password-toggle"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                {showPassword
                  ? "Hide"
                  : "Show"}
              </button>

            </div>

          </div>


          {/* =================================
              OPTIONS
          ================================= */}

          <div className="login-options">

            <label className="remember-me">

              <input
                type="checkbox"
              />

              <span>
                Remember me
              </span>

            </label>


            <Link to="/forgot-password">
              Forgot Password?
            </Link>

          </div>


          {/* =================================
              LOGIN BUTTON
          ================================= */}

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >

            {loading
              ? "Logging in..."
              : "Login"}

          </button>

        </form>


        {/* =================================
            REGISTER
        ================================= */}

        <div className="register-link">

          <p>

            Don't have an account?{" "}

            <Link to="/register">
              Create Account
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
};

export default Login;