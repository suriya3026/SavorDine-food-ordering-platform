import React, { useEffect, useState } from "react";
import {
  Menu,
  Search,
  ShoppingCart,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../../Services/api";
import "./Header.css";

// =====================================================
// USER ID HELPER
// =====================================================

const getUserId = () => {
  const savedUserId = localStorage.getItem("userId");

  if (savedUserId) {
    return savedUserId;
  }

  try {
    const user = JSON.parse(
      localStorage.getItem("user") || "null"
    );

    return user?.id || null;
  } catch {
    return null;
  }
};

// =====================================================
// HEADER
// =====================================================

const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);

  // =====================================================
  // LOAD CART COUNT FROM BACKEND
  // =====================================================

  const loadCartCount = async () => {
    const userId = getUserId();

    if (!userId) {
      setCartCount(0);
      return;
    }

    try {
      const response = await api.get(`/cart/${userId}`);

      const items = Array.isArray(response.data)
        ? response.data
        : [];

      const totalQuantity = items.reduce(
        (total, item) =>
          total + Number(item.quantity || 0),
        0
      );

      setCartCount(totalQuantity);
    } catch (error) {
      console.error("Header cart count error:", error);
      setCartCount(0);
    }
  };

  // =====================================================
  // CART UPDATE LISTENER
  // =====================================================

  useEffect(() => {
    loadCartCount();

    const handleCartUpdate = () => {
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
  }, []);

  // =====================================================
  // SEARCH
  // =====================================================

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

  // =====================================================
  // CART CLICK
  // =====================================================

  const handleCartClick = () => {
    navigate("/cart");
  };

  // =====================================================
  // ADMIN CLICK
  // =====================================================

  const handleAdminClick = () => {
    console.log("Admin button clicked");
    navigate("/adminlogin");
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <header className="header">

      <button
        type="button"
        className="mobile-menu-btn"
        onClick={onMenuClick}
      >
        <Menu size={24} />
      </button>

      <div className="header-title">
        <h2>
          <b>SAVOR DINE </b>
          <span className="header-full-title">
            {" - online Food Ordering"}
          </span>
        </h2>

        <p>Good to see you again !</p>
      </div>

      <div className="header-right">

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

        {/* ADMIN PROFILE */}

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
