
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../Services/api";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    users: 0,
    foods: 0,
    categories: 0,
    orders: 0,
    revenue: 0,
  });

  const [loading, setLoading] = useState(true);

  // ==============================
  // LOAD DASHBOARD DATA
  // ==============================

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [
        usersRes,
        foodsRes,
        categoriesRes,
        ordersRes,
      ] = await Promise.all([
        api.get("/users"),
        api.get("/foods"),
        api.get("/categories"),
        api.get("/orders"),
      ]);

      const users = usersRes.data;
      const foods = foodsRes.data;
      const categories = categoriesRes.data;
      const orders = ordersRes.data;

      const revenue = Array.isArray(orders)
        ? orders.reduce(
            (sum, order) =>
              sum + Number(order.totalAmount || 0),
            0
          )
        : 0;

      setData({
        users: Array.isArray(users) ? users.length : 0,
        foods: Array.isArray(foods) ? foods.length : 0,
        categories: Array.isArray(categories)
          ? categories.length
          : 0,
        orders: Array.isArray(orders) ? orders.length : 0,
        revenue,
      });
    } catch (error) {
      console.error("Dashboard loading error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();

    const interval = setInterval(
      loadDashboard,
      10000
    );

    return () => clearInterval(interval);
  }, []);

  // ==============================
  // ADMIN PAGES
  // ==============================

  const adminPages = [
    {
      title: "Manage Categories",
      description:
        "Add, edit and delete food categories",
      icon: "bi-folder2-open",
      path: "/admin/categories",
    },
    {
      title: "Manage Food",
      description:
        "Add, edit and manage food items",
      icon: "bi-egg-fried",
      path: "/admin/food",
    },
    {
      title: "Manage Orders",
      description:
        "View and manage customer orders",
      icon: "bi-bag-check",
      path: "/admin/orders",
    },
    {
      title: "Manage Users",
      description:
        "View and manage registered users",
      icon: "bi-people",
      path: "/admin/users",
    },
  ];

  return (
    <div className="dashboard-page">

      {/* HEADER */}
      <div className="dashboard-header">

        <div>
          <h1>Admin Dashboard</h1>

          <p>
            Welcome back! Manage your
            Savor Dine application.
          </p>
        </div>

        <button
          className="refresh-btn"
          onClick={loadDashboard}
        >
          <i className="bi bi-arrow-clockwise"></i>
          Refresh
        </button>

      </div>

      {/* STATISTICS */}
      <div className="dashboard-cards">

        {/* USERS */}
        <div className="dashboard-card">

          <div className="card-icon">
            <i className="bi bi-people"></i>
          </div>

          <div className="card-content">

            <span>Total Users</span>

            <h2>
              {loading ? "..." : data.users}
            </h2>

            <small>
              Registered users
            </small>

          </div>

        </div>

        {/* FOOD */}
        <div className="dashboard-card">

          <div className="card-icon">
            <i className="bi bi-egg-fried"></i>
          </div>

          <div className="card-content">

            <span>Total Foods</span>

            <h2>
              {loading ? "..." : data.foods}
            </h2>

            <small>
              Food items
            </small>

          </div>

        </div>

        {/* CATEGORIES */}
        <div className="dashboard-card">

          <div className="card-icon">
            <i className="bi bi-folder2-open"></i>
          </div>

          <div className="card-content">

            <span>Categories</span>

            <h2>
              {loading
                ? "..."
                : data.categories}
            </h2>

            <small>
              Food categories
            </small>

          </div>

        </div>

        {/* ORDERS */}
        <div className="dashboard-card">

          <div className="card-icon">
            <i className="bi bi-bag-check"></i>
          </div>

          <div className="card-content">

            <span>Total Orders</span>

            <h2>
              {loading
                ? "..."
                : data.orders}
            </h2>

            <small>
              Customer orders
            </small>

          </div>

        </div>

        {/* REVENUE */}
        <div className="dashboard-card">

          <div className="card-icon">
            <i className="bi bi-currency-rupee"></i>
          </div>

          <div className="card-content">

            <span>Total Revenue</span>

            <h2>
              {loading
                ? "..."
                : `₹${data.revenue.toLocaleString(
                    "en-IN"
                  )}`}
            </h2>

            <small>
              Order revenue
            </small>

          </div>

        </div>

      </div>

      {/* ADMIN MANAGEMENT */}
      <div className="admin-management">

        <div className="management-header">

          <div>
            <h2>Admin Management</h2>

            <p>
              Access and manage all
              administration pages
            </p>
          </div>

          <i className="bi bi-shield-check"></i>

        </div>

        <div className="admin-management-grid">

          {adminPages.map((page) => (

            <button
              key={page.path}
              type="button"
              className="admin-management-card"
              onClick={() =>
                navigate(page.path)
              }
            >

              <div className="admin-management-icon">

                <i
                  className={`bi ${page.icon}`}
                ></i>

              </div>

              <div className="admin-management-content">

                <h3>
                  {page.title}
                </h3>

                <p>
                  {page.description}
                </p>

              </div>

              <div className="admin-management-arrow">

                <i className="bi bi-arrow-right"></i>

              </div>

            </button>

          ))}

        </div>

      </div>

      {/* SYSTEM OVERVIEW */}
      <div className="system-overview">

        <div className="overview-header">

          <div>
            <h2>System Overview</h2>

            <p>
              Current application statistics
            </p>
          </div>

          <span className="live-badge">
            <span></span>
            Live
          </span>

        </div>

        <div className="overview-grid">

          <div className="overview-item">
            <span>Users</span>
            <strong>{data.users}</strong>
          </div>

          <div className="overview-item">
            <span>Foods</span>
            <strong>{data.foods}</strong>
          </div>

          <div className="overview-item">
            <span>Categories</span>
            <strong>{data.categories}</strong>
          </div>

          <div className="overview-item">
            <span>Orders</span>
            <strong>{data.orders}</strong>
          </div>

        </div>

      </div>

      {/* FOOTER */}
      <div className="dashboard-footer">

        <div>
          <strong>SAVOR DINE</strong>

          <span>
            Admin Management System
          </span>
        </div>

        <div className="backend-status">

          <span></span>

          Backend Connected

        </div>

      </div>

    </div>
  );
};

export default Dashboard;
