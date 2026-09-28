import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Home.css";

import api from "../../Services/api";

// Images
import backgroundImage from "../../assets/images/background.png";
import idliImage from "../../assets/images/brakefast/idli.png";
import mealsImage from "../../assets/images/lunch/South Indian Meals.png";
import parottaImage from "../../assets/images/dinner/Parotta.png";
import biryaniImage from "../../assets/images/lunch/Chicken Biryani.png";

const Home = () => {
  const navigate = useNavigate();

  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [specialFood, setSpecialFood] = useState(null);

  const [orderStats, setOrderStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    cancelled: 0,
  });

  const [diningStats, setDiningStats] = useState({
    totalSpent: 0,
    thisMonth: 0,
    averageOrder: 0,
    saved: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);

  // =====================================================
  // GET LOGGED-IN USER ID
  // =====================================================

  const getUserId = () => {
    const savedUserId = localStorage.getItem("userId");

    if (savedUserId) {
      return savedUserId;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");

      if (user?.id) {
        return user.id;
      }
    } catch (error) {
      console.error("User data parsing error:", error);
    }

    return null;
  };

  // =====================================================
  // LOAD HOME PAGE DATA
  // =====================================================

  const loadHomeData = async () => {
    try {
      setLoading(true);

      const userId = getUserId();

      // ---------------------------------------------
      // LOAD FOODS
      // ---------------------------------------------

      try {
        const foodResponse = await api.get("/foods");

        const foodData = Array.isArray(foodResponse.data)
          ? foodResponse.data
          : [];

        setFoods(foodData);

        // First available food as today's special
        const availableFood = foodData.find(
          (food) => food.available !== false
        );

        if (availableFood) {
          setSpecialFood(availableFood);
        }
      } catch (foodError) {
        console.error("Food loading error:", foodError);
      }

      // ---------------------------------------------
      // LOAD USER ORDERS
      // ---------------------------------------------

      if (!userId) {
        setOrders([]);
        setRecentOrders([]);

        setOrderStats({
          total: 0,
          completed: 0,
          pending: 0,
          cancelled: 0,
        });

        setDiningStats({
          totalSpent: 0,
          thisMonth: 0,
          averageOrder: 0,
          saved: 0,
        });

        return;
      }

      const orderResponse = await api.get(`/orders/user/${userId}`);

      const orderData = Array.isArray(orderResponse.data)
        ? orderResponse.data
        : [];

      setOrders(orderData);

      // =================================================
      // ORDER STATISTICS
      // =================================================

      const totalOrders = orderData.length;

      const completedOrders = orderData.filter((order) => {
        const status = String(order.orderStatus || "").toUpperCase();

        return (
          status === "DELIVERED" ||
          status === "COMPLETED"
        );
      }).length;

      const pendingOrders = orderData.filter((order) => {
        const status = String(order.orderStatus || "").toUpperCase();

        return (
          status === "PLACED" ||
          status === "CONFIRMED" ||
          status === "PREPARING" ||
          status === "OUT_FOR_DELIVERY" ||
          status === "PENDING"
        );
      }).length;

      const cancelledOrders = orderData.filter((order) => {
        const status = String(order.orderStatus || "").toUpperCase();

        return (
          status === "CANCELLED" ||
          status === "CANCELED"
        );
      }).length;

      setOrderStats({
        total: totalOrders,
        completed: completedOrders,
        pending: pendingOrders,
        cancelled: cancelledOrders,
      });

      // =================================================
      // DINING STATISTICS
      // =================================================

      const totalSpent = orderData.reduce(
        (sum, order) =>
          sum + Number(order.totalAmount || 0),
        0
      );

      const now = new Date();

      const thisMonthOrders = orderData.filter((order) => {
        if (!order.orderDate) return false;

        const orderDate = new Date(order.orderDate);

        return (
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear()
        );
      });

      const thisMonthAmount = thisMonthOrders.reduce(
        (sum, order) =>
          sum + Number(order.totalAmount || 0),
        0
      );

      const averageOrder =
        totalOrders > 0
          ? totalSpent / totalOrders
          : 0;

      // No discount/savings field currently exists in backend Order model.
      const savedAmount = 0;

      setDiningStats({
        totalSpent,
        thisMonth: thisMonthAmount,
        averageOrder,
        saved: savedAmount,
      });

      // =================================================
      // RECENT ORDERS
      // =================================================

      const sortedOrders = [...orderData].sort((a, b) => {
        const dateA = new Date(a.orderDate || 0);
        const dateB = new Date(b.orderDate || 0);

        return dateB - dateA;
      });

      const latestOrders = sortedOrders.slice(0, 3);

      // Get order items for recent orders
      const recentWithItems = await Promise.all(
        latestOrders.map(async (order) => {
          try {
            const itemResponse = await api.get(
              `/orders/${order.id}/items`
            );

            const items = Array.isArray(itemResponse.data)
              ? itemResponse.data
              : [];

            const itemNames = items
              .map((item) => item.food?.name)
              .filter(Boolean);

            return {
              ...order,
              itemNames,
            };
          } catch (itemError) {
            console.error(
              `Order ${order.id} items loading error:`,
              itemError
            );

            return {
              ...order,
              itemNames: [],
            };
          }
        })
      );

      setRecentOrders(recentWithItems);
    } catch (error) {
      console.error("Home page backend error:", error);

      setOrders([]);
      setRecentOrders([]);

      setOrderStats({
        total: 0,
        completed: 0,
        pending: 0,
        cancelled: 0,
      });

      setDiningStats({
        totalSpent: 0,
        thisMonth: 0,
        averageOrder: 0,
        saved: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD DATA WHEN PAGE OPENS
  // =====================================================

  useEffect(() => {
    loadHomeData();

    const handleCartUpdated = () => {
      loadHomeData();
    };

    window.addEventListener(
      "cartUpdated",
      handleCartUpdated
    );

    return () => {
      window.removeEventListener(
        "cartUpdated",
        handleCartUpdated
      );
    };
  }, []);

  // =====================================================
  // SPECIAL FOOD
  // =====================================================

  const specialFoodName =
    specialFood?.name || "Chicken Biryani";

  const specialFoodDescription =
    specialFood?.description ||
    "Aromatic rice with tender chicken and authentic spices.";

  const specialFoodPrice =
    specialFood?.price ?? 299;

  const specialFoodImage =
    specialFood?.image
      ? specialFood.image.startsWith("http")
        ? specialFood.image
        : `http://localhost:8080${specialFood.image}`
      : biryaniImage;

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (dateValue) => {
    if (!dateValue) return "-";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {
    const value = String(status || "").toUpperCase();

    if (
      value === "DELIVERED" ||
      value === "COMPLETED"
    ) {
      return "delivered";
    }

    if (
      value === "CANCELLED" ||
      value === "CANCELED"
    ) {
      return "cancelled";
    }

    return "completed";
  };

  // =====================================================
  // STATUS DISPLAY
  // =====================================================

  const getStatusText = (status) => {
    const value = String(status || "PLACED")
      .replaceAll("_", " ")
      .toLowerCase();

    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  // =====================================================
  // RECENT ORDER ITEM NAME
  // =====================================================

  const getItemName = (order) => {
    if (
      order.itemNames &&
      order.itemNames.length > 0
    ) {
      if (order.itemNames.length === 1) {
        return order.itemNames[0];
      }

      return `${order.itemNames[0]} + ${
        order.itemNames.length - 1
      } more`;
    }

    return "Food Order";
  };

  return (
    <main
      className="home-page"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {/* ================= HERO SECTION ================= */}

      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-small-text">
            GOOD FOOD, GOOD MOOD
          </span>

          <h1>
            Delicious Meals
            <br />
            <span>Delivered</span> to You
          </h1>

          <p>
            Fresh ingredients | Great taste | Healthier you
          </p>

          <button
            className="primary-btn"
            onClick={() => navigate("/menu")}
          >
            Order Now
            <i className="bi bi-arrow-right"></i>
          </button>
        </div>

        <div className="hero-food">
          <div className="hero-food-circle">
            <img
              src={
                specialFood
                  ? specialFoodImage
                  : biryaniImage
              }
              alt={specialFoodName}
            />
          </div>
        </div>
      </section>

      {/* ================= FOOD CATEGORIES ================= */}

      <section className="home-section">
        <div className="section-heading">
          <h2>Food Categories</h2>

          <button
            className="view-btn"
            onClick={() => navigate("/menu")}
          >
            View All
            <i className="bi bi-arrow-right"></i>
          </button>
        </div>

        <div className="category-grid">

          {/* Breakfast */}

          <div
            className="category-card"
            onClick={() =>
              navigate(
                "/menu?category=breakfast"
              )
            }
          >
            <div className="category-image">
              <img
                src={idliImage}
                alt="Idli"
              />
            </div>

            <div className="category-info">
              <div>
                <div className="category-title">
                  <i className="bi bi-sun"></i>
                  <h3>Breakfast</h3>
                </div>

                <p>Start your day fresh</p>
              </div>

              <i className="bi bi-arrow-right-circle"></i>
            </div>
          </div>

          {/* Lunch */}

          <div
            className="category-card"
            onClick={() =>
              navigate(
                "/menu?category=lunch"
              )
            }
          >
            <div className="category-image">
              <img
                src={mealsImage}
                alt="South Indian Meals"
              />
            </div>

            <div className="category-info">
              <div>
                <div className="category-title">
                  <i className="bi bi-sun"></i>
                  <h3>Lunch</h3>
                </div>

                <p>A perfect midday meal</p>
              </div>

              <i className="bi bi-arrow-right-circle"></i>
            </div>
          </div>

          {/* Dinner */}

          <div
            className="category-card"
            onClick={() =>
              navigate(
                "/menu?category=dinner"
              )
            }
          >
            <div className="category-image">
              <img
                src={parottaImage}
                alt="Parotta"
              />
            </div>

            <div className="category-info">
              <div>
                <div className="category-title">
                  <i className="bi bi-moon"></i>
                  <h3>Dinner</h3>
                </div>

                <p>End your day deliciously</p>
              </div>

              <i className="bi bi-arrow-right-circle"></i>
            </div>
          </div>

        </div>
      </section>

      {/* ================= SPECIAL + OFFER ================= */}

      <section className="special-grid">

        {/* Today's Special */}

        <div className="special-card">

          <div className="special-header">
            <div>
              <div className="title-with-icon">
                <i className="bi bi-stars"></i>
                <h2>Today's Special</h2>
              </div>

              <p>
                A special dish for a special day!
              </p>
            </div>

            <span className="chef-badge">
              Chef's Special
            </span>
          </div>

          <div className="special-body">

            <div className="special-food-image">
              <img
                src={specialFoodImage}
                alt={specialFoodName}
              />
            </div>

            <div className="special-details">

              <h3>{specialFoodName}</h3>

              <p>
                {specialFoodDescription}
              </p>

              <div className="rating">
                <span>⭐</span>
                {specialFood?.rating || "4.8"}
                <span>
                  ({specialFood?.reviewCount || "320"} reviews)
                </span>
              </div>

              <div className="price-row">

                <strong>
                  ₹{Number(specialFoodPrice).toLocaleString("en-IN")}
                </strong>

                <button
                  className="dark-btn"
                  onClick={() => {
                    if (specialFood?.id) {
                      navigate(
                        `/food/${specialFood.id}`
                      );
                    } else {
                      navigate("/menu");
                    }
                  }}
                >
                  Order Now
                </button>

              </div>

            </div>

          </div>
        </div>

        {/* Today's Offer */}

        <div className="offer-card">

          <div className="offer-top">
            <div>
              <div className="title-with-icon">
                <i className="bi bi-gift"></i>
                <h2>Today's Offer</h2>
              </div>

              <p>
                Grab the best deal today!
              </p>
            </div>
          </div>

          <div className="offer-content">

            <h3>30% OFF</h3>

            <h4>
              on your first order
            </h4>

            <p>
              Use code:
              <strong>SAVOR30</strong>
            </p>

            <button
              className="offer-btn"
              onClick={() => navigate("/menu")}
            >
              Order Now
            </button>

          </div>

        </div>

      </section>

      {/* ================= OVERALL DETAILS ================= */}

      <section className="overview-grid">

        {/* Order Overview */}

        <div className="overview-card">

          <div className="overview-header">

            <div className="overview-title">
              <i className="bi bi-bar-chart-fill"></i>
              <h2>Order Overview</h2>
            </div>

            <select defaultValue="This Month">
              <option>This Month</option>
              <option>Last Month</option>
            </select>

          </div>

          <div className="stats-grid">

            <div className="stat-box">
              <div className="stat-icon blue">
                <i className="bi bi-box-seam"></i>
              </div>

              <strong>
                {loading ? "..." : orderStats.total}
              </strong>

              <span>Total Orders</span>
            </div>

            <div className="stat-box">
              <div className="stat-icon green">
                <i className="bi bi-check-circle-fill"></i>
              </div>

              <strong>
                {loading
                  ? "..."
                  : orderStats.completed}
              </strong>

              <span>Completed</span>
            </div>

            <div className="stat-box">
              <div className="stat-icon orange">
                <i className="bi bi-clock-fill"></i>
              </div>

              <strong>
                {loading
                  ? "..."
                  : orderStats.pending}
              </strong>

              <span>Pending</span>
            </div>

            <div className="stat-box">
              <div className="stat-icon red">
                <i className="bi bi-x-circle-fill"></i>
              </div>

              <strong>
                {loading
                  ? "..."
                  : orderStats.cancelled}
              </strong>

              <span>Cancelled</span>
            </div>

          </div>
        </div>

        {/* Dining Summary */}

        <div className="overview-card">

          <div className="overview-header">

            <div className="overview-title">
              <i className="bi bi-pie-chart-fill"></i>
              <h2>Dining Summary</h2>
            </div>

            <select defaultValue="This Month">
              <option>This Month</option>
              <option>Last Month</option>
            </select>

          </div>

          <div className="stats-grid">

            <div className="stat-box">
              <div className="stat-icon purple">
                <i className="bi bi-wallet2"></i>
              </div>

              <strong>
                {loading
                  ? "..."
                  : `₹${diningStats.totalSpent.toLocaleString("en-IN")}`}
              </strong>

              <span>Total Spent</span>
            </div>

            <div className="stat-box">
              <div className="stat-icon green">
                <i className="bi bi-bar-chart-fill"></i>
              </div>

              <strong>
                {loading
                  ? "..."
                  : `₹${diningStats.thisMonth.toLocaleString("en-IN")}`}
              </strong>

              <span>This Month</span>
            </div>

            <div className="stat-box">
              <div className="stat-icon blue">
                <i className="bi bi-graph-up-arrow"></i>
              </div>

              <strong>
                {loading
                  ? "..."
                  : `₹${Math.round(
                      diningStats.averageOrder
                    ).toLocaleString("en-IN")}`}
              </strong>

              <span>Avg. Order</span>
            </div>

            <div className="stat-box">
              <div className="stat-icon pink">
                <i className="bi bi-piggy-bank-fill"></i>
              </div>

              <strong>
                {loading
                  ? "..."
                  : `₹${diningStats.saved.toLocaleString("en-IN")}`}
              </strong>

              <span>You Saved</span>
            </div>

          </div>
        </div>

      </section>

      {/* ================= QUICK ACTIONS ================= */}

      <section className="home-section">

        <div className="section-heading">
          <h2>Quick Actions</h2>
        </div>

        <div className="quick-grid">

          {/* Order Food */}

          <div
            className="quick-card"
            onClick={() => navigate("/menu")}
          >
            <div className="quick-icon red-icon">
              <i className="bi bi-cart-fill"></i>
            </div>

            <div className="quick-text">
              <h3>Order Food</h3>
              <p>Explore our menu</p>
            </div>

            <i className="bi bi-arrow-right"></i>
          </div>

          {/* Reorder */}

          <div
            className="quick-card"
            onClick={() => navigate("/orders")}
          >
            <div className="quick-icon green-icon">
              <i className="bi bi-arrow-repeat"></i>
            </div>

            <div className="quick-text">
              <h3>Reorder</h3>
              <p>Your previous meals</p>
            </div>

            <i className="bi bi-arrow-right"></i>
          </div>

          {/* Track Order */}

          <div
            className="quick-card"
            onClick={() => navigate("/orders")}
          >
            <div className="quick-icon blue-icon">
              <i className="bi bi-box-seam-fill"></i>
            </div>

            <div className="quick-text">
              <h3>Track Order</h3>
              <p>Check your order status</p>
            </div>

            <i className="bi bi-arrow-right"></i>
          </div>

        </div>

      </section>

      {/* ================= RECENT ACTIVITY ================= */}

      <section className="home-section recent-section">

        <div className="section-heading">

          <h2>Recent Activity</h2>

          <button
            className="view-btn"
            onClick={() => navigate("/orders")}
          >
            View All
            <i className="bi bi-arrow-right"></i>
          </button>

        </div>

        <div className="table-container">

          <table>

            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {loading ? (

                <tr>
                  <td colSpan="6">
                    Loading orders...
                  </td>
                </tr>

              ) : recentOrders.length === 0 ? (

                <tr>
                  <td colSpan="6">
                    No orders found
                  </td>
                </tr>

              ) : (

                recentOrders.map((order) => (

                  <tr key={order.id}>

                    <td>
                      #{order.id}
                    </td>

                    <td>
                      {formatDate(
                        order.orderDate
                      )}
                    </td>

                    <td>
                      {getItemName(order)}
                    </td>

                    <td>
                      ₹
                      {Number(
                        order.totalAmount || 0
                      ).toLocaleString("en-IN")}
                    </td>

                    <td>
                      <span
                        className={`status ${getStatusClass(
                          order.orderStatus
                        )}`}
                      >
                        {getStatusText(
                          order.orderStatus
                        )}
                      </span>
                    </td>

                    <td>
                      <button
                        className="view-order"
                        onClick={() =>
                          navigate(
                            `/order-tracking?orderId=${order.id}`
                          )
                        }
                      >
                        View
                      </button>
                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </section>

      {/* ================= QUOTE ================= */}

      <div className="home-quote">

        <span>“</span>

        <div>
          <h3>
            Good food brings people together.
          </h3>

          <p>
            – Savor Dine
          </p>
        </div>

        <span>”</span>

      </div>

    </main>
  );
};

export default Home;