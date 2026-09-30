import React, { useEffect, useState, useCallback } from "react";
import { Menu, Search, ShoppingCart, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../../Services/api";
import "./Header.css";

const getUserId = () => {
  const userId = localStorage.getItem("userId");

  if (userId) {
    return userId;
  }

  try {
    const user = JSON.parse(
      localStorage.getItem("user") || "null"
    );

    return user?.id || null;
  } catch (error) {
    console.error("User data error:", error);
    return null;
  }
};

const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);

  // =========================
  // LOAD CART COUNT
  // =========================
  const loadCartCount = useCallback(async () => {
    try {
      const userId = getUserId();

      console.log("Header User ID:", userId);

      if (!userId) {
        setCartCount(0);
        return;
      }

      const response = await api.get(
        `/cart/${Number(userId)}`
      );

      console.log(
        "Header Cart Response:",
        response.data
      );

      const cartItems = Array.isArray(response.data)
        ? response.data
        : [];

      const totalQuantity = cartItems.reduce(
        (total, item) =>
          total + Number(item.quantity || 0),
        0
      );

      console.log(
        "Header Cart Count:",
        totalQuantity
      );

      setCartCount(totalQuantity);

    } catch (error) {
      console.error(
        "Header Cart Count Error:",
        error.response?.data || error.message
      );

      setCartCount(0);
    }
  }, []);

  // =========================
  // LOAD WHEN HEADER OPENS
  // =========================
  useEffect(() => {
    loadCartCount();
  }, [loadCartCount]);

  // =========================
  // LISTEN CART UPDATED EVENT
  // =========================
  useEffect(() => {

    const handleCartUpdate = () => {
      console.log(
        "Header received cartUpdated event"
      );

      loadCartCount();
    };

    window.addEventListener(
      "cartUpdated",
      handleCartUpdate
    );

    return () => {
      window.removeEventListener(
        "cartUpdated",
        handleCartUpdate
      );
    };

  }, [loadCartCount]);

  // =========================
  // SEARCH
  // =========================
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchKeyDown = (e) => {

    if (e.key === "Enter") {

      if (search.trim() !== "") {

        navigate(
          `/menu?search=${encodeURIComponent(
            search.trim()
          )}`
        );

      } else {

        navigate("/menu");

      }
    }
  };

  // =========================
  // CART
  // =========================
  const handleCartClick = () => {
    navigate("/cart");
  };

  // =========================
  // ADMIN
  // =========================
  const handleAdminClick = () => {
    navigate("/adminlogin");
  };

  return (
    <header className="header">

      {/* MOBILE MENU */}
      <button
        type="button"
        className="mobile-menu-btn"
        onClick={onMenuClick}
      >
        <Menu size={24} />
      </button>

      {/* TITLE */}
      <div className="header-title">

        <h2>
          <b>SAVOR DINE </b>

          <span className="header-full-title">
            {" - online Food Ordering"}
          </span>
        </h2>

        <p>
          Good to see you again !
        </p>

      </div>

      {/* RIGHT SIDE */}
      <div className="header-right">

        {/* SEARCH */}
        <div className="header-search">

          <Search size={19} />

          <input
            type="text"
            placeholder="Search food..."
            value={search}
            onChange={handleSearch}
            onKeyDown={handleSearchKeyDown}
          />

        </div>

        {/* CART */}
        <button
          type="button"
          className="cart-btn"
          onClick={handleCartClick}
          title="View Cart"
        >

          <ShoppingCart size={21} />

          <span className="cart-count">
            {cartCount}
          </span>

        </button>

        {/* ADMIN */}
        <button
          type="button"
          className="header-profile"
          onClick={handleAdminClick}
          title="Administration"
        >

          <div className="profile-icon">
            <User size={19} />
          </div>

          <div className="profile-info">

            <span className="profile-name">
              Admin
            </span>

            <span className="profile-role">
              Administrator
            </span>

          </div>

        </button>

      </div>

    </header>
  );
};

export default Header;
