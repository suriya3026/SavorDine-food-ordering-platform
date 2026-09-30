import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Settings.css";

import { getUserById } from "../../Services/userService";

const Settings = () => {
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
  });

  const [loading, setLoading] = useState(true);

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    offers: true,
    emailNotifications: false,
  });

  // ==========================================
  // LOAD USER
  // ==========================================

  const loadUser = async () => {
    if (!userId) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const data = await getUserById(userId);

      setUser({
        name: data?.name || "",
        email: data?.email || "",
        phone: data?.phone || "",
        role: data?.role || "USER",
      });
    } catch (error) {
      console.error("Settings User Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD NOTIFICATION SETTINGS
  // ==========================================

  const loadNotificationSettings = () => {
    const savedSettings = localStorage.getItem(
      "notificationSettings"
    );

    if (savedSettings) {
      try {
        setNotifications(JSON.parse(savedSettings));
      } catch (error) {
        console.error(
          "Notification Settings Error:",
          error
        );
      }
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadUser();
    loadNotificationSettings();
  }, []);

  // ==========================================
  // NOTIFICATION CHANGE
  // ==========================================

  const handleNotificationChange = (name) => {
    setNotifications((previous) => {
      const updated = {
        ...previous,
        [name]: !previous[name],
      };

      localStorage.setItem(
        "notificationSettings",
        JSON.stringify(updated)
      );

      return updated;
    });
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) return;

    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("lastOrderId");

    navigate("/login");
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="settings-page">

        <div className="settings-loading">

          <div className="loading-spinner"></div>

          <p>
            Loading settings...
          </p>

        </div>

      </div>
    );
  }

  // ==========================================
  // MAIN
  // ==========================================

  return (
    <div className="settings-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="settings-header">

        <div>
          <h1>
            <i className="bi bi-gear"></i>{" "}
            Settings
          </h1>

          <p>
            Manage your Savor Dine account
            preferences
          </p>
        </div>

      </div>

      {/* ======================================
          ACCOUNT
      ====================================== */}

      <div className="settings-card">

        <div className="settings-card-header">

          <div className="settings-icon">
            <i className="bi bi-person-circle"></i>
          </div>

          <div>
            <h2>
              Account
            </h2>

            <p>
              Your account information
            </p>
          </div>

        </div>

        <div className="account-details">

          <div className="account-detail">

            <span>
              Name
            </span>

            <strong>
              {user.name || "Not available"}
            </strong>

          </div>

          <div className="account-detail">

            <span>
              Email
            </span>

            <strong>
              {user.email || "Not available"}
            </strong>

          </div>

          <div className="account-detail">

            <span>
              Phone
            </span>

            <strong>
              {user.phone || "Not added"}
            </strong>

          </div>

          <div className="account-detail">

            <span>
              Role
            </span>

            <strong className="role-badge">
              {user.role || "USER"}
            </strong>

          </div>

        </div>

        <button
          type="button"
          className="profile-settings-btn"
          onClick={() => navigate("/profile")}
        >
          <i className="bi bi-pencil-square"></i>
          Manage Profile
        </button>

      </div>

      {/* ======================================
          NOTIFICATIONS
      ====================================== */}

      <div className="settings-card">

        <div className="settings-card-header">

          <div className="settings-icon">
            <i className="bi bi-bell"></i>
          </div>

          <div>
            <h2>
              Notifications
            </h2>

            <p>
              Choose which notifications you want
              to receive
            </p>
          </div>

        </div>

        <div className="settings-options">

          {/* ORDER UPDATES */}

          <div className="settings-option">

            <div className="option-info">

              <div className="option-icon">
                <i className="bi bi-bag-check"></i>
              </div>

              <div>
                <strong>
                  Order Updates
                </strong>

                <span>
                  Receive updates about your
                  orders
                </span>
              </div>

            </div>

            <label className="switch">

              <input
                type="checkbox"
                checked={
                  notifications.orderUpdates
                }
                onChange={() =>
                  handleNotificationChange(
                    "orderUpdates"
                  )
                }
              />

              <span className="slider"></span>

            </label>

          </div>

          {/* OFFERS */}

          <div className="settings-option">

            <div className="option-info">

              <div className="option-icon">
                <i className="bi bi-tag"></i>
              </div>

              <div>
                <strong>
                  Offers & Promotions
                </strong>

                <span>
                  Get updates about special
                  offers
                </span>
              </div>

            </div>

            <label className="switch">

              <input
                type="checkbox"
                checked={
                  notifications.offers
                }
                onChange={() =>
                  handleNotificationChange(
                    "offers"
                  )
                }
              />

              <span className="slider"></span>

            </label>

          </div>

          {/* EMAIL */}

          <div className="settings-option">

            <div className="option-info">

              <div className="option-icon">
                <i className="bi bi-envelope"></i>
              </div>

              <div>
                <strong>
                  Email Notifications
                </strong>

                <span>
                  Receive important updates through
                  email
                </span>
              </div>

            </div>

            <label className="switch">

              <input
                type="checkbox"
                checked={
                  notifications.emailNotifications
                }
                onChange={() =>
                  handleNotificationChange(
                    "emailNotifications"
                  )
                }
              />

              <span className="slider"></span>

            </label>

          </div>

        </div>

      </div>

      {/* ======================================
          ORDER SETTINGS
      ====================================== */}

      <div className="settings-card">

        <div className="settings-card-header">

          <div className="settings-icon">
            <i className="bi bi-bag-check"></i>
          </div>

          <div>
            <h2>
              Orders
            </h2>

            <p>
              Quickly access your order
              information
            </p>
          </div>

        </div>

        <div className="settings-actions">

          <button
            type="button"
            onClick={() => navigate("/orders")}
          >
            <i className="bi bi-bag"></i>

            <span>
              My Orders
            </span>

            <i className="bi bi-chevron-right"></i>
          </button>

          <button
            type="button"
            onClick={() => navigate("/cart")}
          >
            <i className="bi bi-cart3"></i>

            <span>
              My Cart
            </span>

            <i className="bi bi-chevron-right"></i>
          </button>

        </div>

      </div>

      {/* ======================================
          SECURITY
      ====================================== */}

      <div className="settings-card">

        <div className="settings-card-header">

          <div className="settings-icon">
            <i className="bi bi-shield-lock"></i>
          </div>

          <div>
            <h2>
              Security
            </h2>

            <p>
              Manage your account security
            </p>
          </div>

        </div>

        <div className="security-info">

          <div className="security-status">

            <i className="bi bi-shield-check"></i>

            <div>
              <strong>
                Account Protected
              </strong>

              <span>
                Your account is connected to the
                Savor Dine backend.
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* ======================================
          LOGOUT
      ====================================== */}

      <div className="logout-card">

        <div>

          <h2>
            Logout
          </h2>

          <p>
            Sign out from your Savor Dine account
            on this device.
          </p>

        </div>

        <button
          type="button"
          className="logout-btn"
          onClick={handleLogout}
        >
          <i className="bi bi-box-arrow-right"></i>
          Logout
        </button>

      </div>

      {/* ======================================
          FOOTER
      ====================================== */}

      <div className="settings-footer">

        <strong>
          SAVOR DINE
        </strong>

        <span>
          Smart Food Ordering Platform
        </span>

      </div>

    </div>
  );
};

export default Settings;