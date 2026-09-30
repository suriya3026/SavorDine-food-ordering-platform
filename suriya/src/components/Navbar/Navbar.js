
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import logo from "../../assets/images/logo.png";

import "./Navbar.css";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  // ================================
  // CLOSE NAVBAR
  // ================================

  const closeNavbar = () => {
    setIsOpen(false);
  };

  // ================================
  // LOGOUT
  // ================================

  const handleLogout = () => {
    // Remove authentication token
    localStorage.removeItem("token");

    // Remove logged-in user data if stored
    localStorage.removeItem("user");

    // Close mobile navbar
    setIsOpen(false);

    // Redirect to login page
    navigate("/login", { replace: true });
  };

  // ================================
  // MAIN MENU
  // ================================

  const mainMenu = [
    {
      name: "Home",
      path: "/home",
      icon: "bi-house-door",
    },
    {
      name: "Menu",
      path: "/menu",
      icon: "bi-egg-fried",
    },
    {
      name: "Cart",
      path: "/cart",
      icon: "bi-cart3",
    },
    {
      name: "My Orders",
      path: "/orders",
      icon: "bi-box-seam",
    },
    {
      name: "Offers",
      path: "/offers",
      icon: "bi-tag",
    },
    {
      name: "Profile",
      path: "/profile",
      icon: "bi-person",
    },
  ];

  // ================================
  // BOTTOM MENU
  // ================================

  const bottomMenu = [
    {
      name: "Settings",
      path: "/settings",
      icon: "bi-gear",
    },
    {
      name: "Admin Panel",
      path: "/adminlogin",
      icon: "bi-shield-check",
    },
  ];

  return (
    <>
      {/* ================================
          MOBILE TOGGLE
      ================================= */}

      <button
        type="button"
        className="mobile-menu-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation"
      >
        <i
          className={
            isOpen
              ? "bi bi-x-lg"
              : "bi bi-list"
          }
        ></i>
      </button>

      {/* ================================
          MOBILE OVERLAY
      ================================= */}

      {isOpen && (
        <div
          className="navbar-overlay"
          onClick={closeNavbar}
        ></div>
      )}

      {/* ================================
          SIDEBAR
      ================================= */}

      <aside
        className={`savor-sidebar ${
          isOpen ? "mobile-open" : ""
        }`}
      >
        {/* ================================
            LOGO
        ================================= */}

        <div className="savor-brand">
          <img
            src={logo}
            alt="Savor Dine Logo"
            className="savor-logo"
          />
        </div>

        {/* ================================
            DIVIDER
        ================================= */}

        <div className="savor-divider"></div>

        {/* ================================
            MAIN MENU
        ================================= */}

        <nav className="savor-menu">
          {mainMenu.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={closeNavbar}
              className={({ isActive }) =>
                `savor-link ${
                  isActive ? "active" : ""
                }`
              }
            >
              <i
                className={`bi ${item.icon}`}
              ></i>

              <span>
                {item.name}
              </span>

              {item.badge && (
                <span className="cart-badge">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* ================================
            DIVIDER
        ================================= */}

        <div className="savor-divider"></div>

        {/* ================================
            SETTINGS + ADMIN
        ================================= */}

        <nav className="savor-menu">
          {bottomMenu.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={closeNavbar}
              className={({ isActive }) =>
                `savor-link ${
                  isActive ? "active" : ""
                }`
              }
            >
              <i
                className={`bi ${item.icon}`}
              ></i>

              <span>
                {item.name}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* ================================
            LOGOUT
        ================================= */}

        <div className="logout-container">
          <button
            type="button"
            className="logout-btn"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right"></i>

            <span>
              Logout
            </span>
          </button>
        </div>

        {/* ================================
            QUOTE
        ================================= */}

        <div className="savor-quote">
          <span>Good Food</span>
          <span>Brighter Days</span>

          <i className="bi bi-leaf"></i>
        </div>
      </aside>
    </>
  );
}

export default Navbar;
