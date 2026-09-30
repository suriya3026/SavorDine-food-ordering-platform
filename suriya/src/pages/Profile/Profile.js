import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

import {
  getUserById,
  updateUser,
} from "../../Services/userService";

const Profile = () => {
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD PROFILE
  // ==========================================

  const loadProfile = async () => {
    if (!userId) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getUserById(userId);

      const userData = {
        name: data?.name || "",
        email: data?.email || "",
        phone: data?.phone || "",
        address: data?.address || "",
      };

      setProfile(userData);
      setFormData(userData);

      // Keep localStorage user data updated
      const oldUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...oldUser,
          ...data,
        })
      );
    } catch (err) {
      console.error("Profile Load Error:", err);

      setError(
        "Unable to load profile details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // EDIT
  // ==========================================

  const handleEdit = () => {
    setFormData(profile);
    setEditing(true);
    setError("");
  };

  // ==========================================
  // CANCEL
  // ==========================================

  const handleCancel = () => {
    setFormData(profile);
    setEditing(false);
    setError("");
  };

  // ==========================================
  // SAVE PROFILE
  // ==========================================

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const updatedUser = await updateUser(
        userId,
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
        }
      );

      const updatedProfile = {
        name: updatedUser?.name ?? formData.name,
        email: updatedUser?.email ?? formData.email,
        phone: updatedUser?.phone ?? formData.phone,
        address:
          updatedUser?.address ?? formData.address,
      };

      setProfile(updatedProfile);
      setFormData(updatedProfile);

      // Update localStorage
      const oldUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...oldUser,
          ...updatedUser,
        })
      );

      setEditing(false);

      alert("Profile updated successfully.");
    } catch (err) {
      console.error("Profile Update Error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN
  // ==========================================

  return (
    <div className="profile-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="profile-header">

        <div>
          <h1>
            <i className="bi bi-person-circle"></i>{" "}
            My Profile
          </h1>

          <p>
            Manage your Savor Dine account details
          </p>
        </div>

        {!editing && (
          <button
            type="button"
            className="edit-profile-btn"
            onClick={handleEdit}
          >
            <i className="bi bi-pencil-square"></i>
            Edit Profile
          </button>
        )}

      </div>

      {/* ======================================
          ERROR
      ====================================== */}

      {error && (
        <div className="profile-error">
          <i className="bi bi-exclamation-circle"></i>
          <span>{error}</span>
        </div>
      )}

      {/* ======================================
          PROFILE CARD
      ====================================== */}

      <div className="profile-card">

        {/* PROFILE TOP */}

        <div className="profile-top">

          <div className="profile-avatar">
            {profile.name
              ? profile.name.charAt(0).toUpperCase()
              : "U"}
          </div>

          <div className="profile-basic">

            <h2>
              {profile.name || "User"}
            </h2>

            <p>
              <i className="bi bi-envelope"></i>
              {profile.email}
            </p>

            <span className="user-role">
              <i className="bi bi-person-badge"></i>
              Customer
            </span>

          </div>

        </div>

        {/* PROFILE FORM */}

        <form
          className="profile-form"
          onSubmit={handleSave}
        >

          {/* NAME */}

          <div className="profile-field">

            <label htmlFor="name">
              <i className="bi bi-person"></i>
              Full Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              disabled={!editing}
              placeholder="Enter your name"
            />

          </div>

          {/* EMAIL */}

          <div className="profile-field">

            <label htmlFor="email">
              <i className="bi bi-envelope"></i>
              Email Address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!editing}
              placeholder="Enter your email"
            />

          </div>

          {/* PHONE */}

          <div className="profile-field">

            <label htmlFor="phone">
              <i className="bi bi-telephone"></i>
              Phone Number
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              disabled={!editing}
              placeholder="Enter your phone number"
            />

          </div>

          {/* ADDRESS */}

          <div className="profile-field profile-address">

            <label htmlFor="address">
              <i className="bi bi-geo-alt"></i>
              Delivery Address
            </label>

            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={!editing}
              placeholder="Enter your delivery address"
              rows="4"
            />

          </div>

          {/* BUTTONS */}

          {editing && (
            <div className="profile-actions">

              <button
                type="button"
                className="cancel-profile-btn"
                onClick={handleCancel}
                disabled={saving}
              >
                <i className="bi bi-x-lg"></i>
                Cancel
              </button>

              <button
                type="submit"
                className="save-profile-btn"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="button-spinner"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-lg"></i>
                    Save Changes
                  </>
                )}
              </button>

            </div>
          )}

        </form>

      </div>

      {/* ======================================
          ACCOUNT INFORMATION
      ====================================== */}

      <div className="profile-info-grid">

        <div className="profile-info-box">

          <div className="info-icon">
            <i className="bi bi-shield-check"></i>
          </div>

          <div>
            <h3>
              Account Security
            </h3>

            <p>
              Your account details are securely
              stored in the backend.
            </p>
          </div>

        </div>

        <div className="profile-info-box">

          <div className="info-icon">
            <i className="bi bi-bag-check"></i>
          </div>

          <div>
            <h3>
              Your Orders
            </h3>

            <p>
              View and track your previous orders.
            </p>

            <button
              type="button"
              onClick={() => navigate("/orders")}
            >
              View Orders
              <i className="bi bi-arrow-right"></i>
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Profile;