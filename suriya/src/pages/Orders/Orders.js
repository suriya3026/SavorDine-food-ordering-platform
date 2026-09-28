
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Orders.css";

import {
  getOrdersByUser,
  getOrderItems,
} from "../../Services/orderService";

const Orders = () => {
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD ORDERS
  // ==========================================

  const loadOrders = useCallback(async () => {
    if (!userId) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getOrdersByUser(userId);

      const orderList = Array.isArray(data) ? data : [];

      setOrders(orderList);

      // Load items for every order
      const itemsData = {};

      await Promise.all(
        orderList.map(async (order) => {
          try {
            const items = await getOrderItems(order.id);

            itemsData[order.id] = Array.isArray(items)
              ? items
              : [];
          } catch (err) {
            console.error(
              `Order ${order.id} items error:`,
              err
            );

            itemsData[order.id] = [];
          }
        })
      );

      setOrderItems(itemsData);
    } catch (err) {
      console.error("Orders Error:", err);

      setError(
        "Unable to load your orders. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [userId, navigate]);

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // ==========================================
  // STATUS CLASS
  // ==========================================

  const getStatusClass = (status) => {
    switch (status?.toUpperCase()) {
      case "PLACED":
        return "status-placed";

      case "CONFIRMED":
        return "status-confirmed";

      case "PREPARING":
        return "status-preparing";

      case "OUT_FOR_DELIVERY":
        return "status-delivery";

      case "DELIVERED":
        return "status-delivered";

      case "CANCELLED":
        return "status-cancelled";

      default:
        return "status-placed";
    }
  };

  // ==========================================
  // STATUS TEXT
  // ==========================================

  const getStatusText = (status) => {
    switch (status?.toUpperCase()) {
      case "OUT_FOR_DELIVERY":
        return "Out for Delivery";

      case "PLACED":
        return "Order Placed";

      case "CONFIRMED":
        return "Confirmed";

      case "PREPARING":
        return "Preparing";

      case "DELIVERED":
        return "Delivered";

      case "CANCELLED":
        return "Cancelled";

      default:
        return status || "Placed";
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    try {
      return new Date(date).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Date unavailable";
    }
  };

  // ==========================================
  // TRACK ORDER
  // ==========================================

  const handleTrackOrder = (orderId) => {
    navigate("/ordertracking", {
      state: {
        orderId: orderId,
      },
    });
  };

  // ==========================================
  // VIEW ORDER
  // ==========================================

  const handleViewOrder = (orderId) => {
    navigate("/ordertracking", {
      state: {
        orderId: orderId,
      },
    });
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-loading">
          <div className="loading-spinner"></div>

          <p>
            Loading your orders...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN
  // ==========================================

  return (
    <div className="orders-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="orders-header">

        <div>
          <h1>
            <i className="bi bi-bag-check"></i>{" "}
            My Orders
          </h1>

          <p>
            View and track all your Savor Dine orders
          </p>
        </div>

        <button
          type="button"
          className="refresh-orders-btn"
          onClick={loadOrders}
        >
          <i className="bi bi-arrow-clockwise"></i>
          Refresh
        </button>

      </div>

      {/* ======================================
          ERROR
      ====================================== */}

      {error && (
        <div className="orders-error">

          <i className="bi bi-exclamation-circle"></i>

          <span>
            {error}
          </span>

          <button
            type="button"
            onClick={loadOrders}
          >
            Try Again
          </button>

        </div>
      )}

      {/* ======================================
          NO ORDERS
      ====================================== */}

      {!error && orders.length === 0 ? (

        <div className="no-orders">

          <div className="no-orders-icon">
            <i className="bi bi-bag-x"></i>
          </div>

          <h2>
            No Orders Yet
          </h2>

          <p>
            You haven't placed any orders yet.
            Explore our menu and order something
            delicious!
          </p>

          <button
            type="button"
            className="browse-menu-btn"
            onClick={() => navigate("/menu")}
          >
            <i className="bi bi-shop"></i>
            Browse Menu
          </button>

        </div>

      ) : (

        <div className="orders-list">

          {orders.map((order) => {

            const items =
              orderItems[order.id] || [];

            return (
              <div
                className="order-card"
                key={order.id}
              >

                {/* ============================
                    ORDER HEADER
                ============================ */}

                <div className="order-card-header">

                  <div className="order-id-section">

                    <span>
                      Order ID
                    </span>

                    <strong>
                      #{order.id}
                    </strong>

                  </div>

                  <div
                    className={`order-status ${getStatusClass(
                      order.orderStatus
                    )}`}
                  >
                    <span className="status-dot"></span>

                    {getStatusText(
                      order.orderStatus
                    )}
                  </div>

                </div>

                {/* ============================
                    ORDER INFO
                ============================ */}

                <div className="order-info">

                  <div className="order-info-item">

                    <i className="bi bi-calendar3"></i>

                    <div>
                      <span>
                        Order Date
                      </span>

                      <strong>
                        {formatDate(
                          order.orderDate
                        )}
                      </strong>
                    </div>

                  </div>

                  <div className="order-info-item">

                    <i className="bi bi-credit-card"></i>

                    <div>
                      <span>
                        Payment
                      </span>

                      <strong>
                        {order.paymentStatus ||
                          "PENDING"}
                      </strong>
                    </div>

                  </div>

                  <div className="order-info-item">

                    <i className="bi bi-geo-alt"></i>

                    <div>
                      <span>
                        Delivery
                      </span>

                      <strong>
                        {order.deliveryAddress ||
                          "Address unavailable"}
                      </strong>
                    </div>

                  </div>

                </div>

                {/* ============================
                    ORDER ITEMS
                ============================ */}

                {items.length > 0 && (
                  <div className="order-items">

                    <h3>
                      Order Items
                    </h3>

                    {items.map((item) => (

                      <div
                        className="order-item"
                        key={item.id}
                      >

                        <div className="order-item-info">

                          <div className="order-item-icon">
                            <i className="bi bi-egg-fried"></i>
                          </div>

                          <div>

                            <strong>
                              {item.food?.name ||
                                "Food Item"}
                            </strong>

                            <span>
                              Qty: {item.quantity}
                            </span>

                          </div>

                        </div>

                        <strong className="order-item-price">
                          ₹
                          {(
                            Number(item.price || 0) *
                            Number(item.quantity || 0)
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                      </div>

                    ))}

                  </div>
                )}

                {/* ============================
                    ORDER FOOTER
                ============================ */}

                <div className="order-card-footer">

                  <div className="order-total">

                    <span>
                      Total Amount
                    </span>

                    <strong>
                      ₹
                      {Number(
                        order.totalAmount || 0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                  </div>

                  <div className="order-actions">

                    {/* VIEW ORDER */}

                    <button
                      type="button"
                      className="view-order-btn"
                      onClick={() =>
                        handleViewOrder(order.id)
                      }
                    >
                      <i className="bi bi-eye"></i>
                      View Order
                    </button>

                    {/* TRACK ORDER */}

                    {order.orderStatus !==
                      "DELIVERED" &&
                      order.orderStatus !==
                        "CANCELLED" && (

                      <button
                        type="button"
                        className="track-order-btn"
                        onClick={() =>
                          handleTrackOrder(
                            order.id
                          )
                        }
                      >
                        <i className="bi bi-geo-alt"></i>
                        Track Order
                      </button>

                    )}

                  </div>

                </div>

              </div>
            );
          })}

        </div>

      )}

    </div>
  );
};

export default Orders;
