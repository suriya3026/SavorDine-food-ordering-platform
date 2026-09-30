import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./OrderTracking.css";

import {
  getOrderById,
  getOrderItems,
} from "../../Services/orderService";

const OrderTracking = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const orderId =
    location.state?.orderId ||
    localStorage.getItem("lastOrderId");

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD ORDER
  // ==========================================

  const loadOrder = async () => {
    if (!orderId) {
      setError("Order ID not found.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const orderData = await getOrderById(orderId);

      setOrder(orderData);

      try {
        const orderItems = await getOrderItems(orderId);

        setItems(
          Array.isArray(orderItems)
            ? orderItems
            : []
        );
      } catch (itemError) {
        console.error(
          "Order Items Error:",
          itemError
        );

        setItems([]);
      }
    } catch (err) {
      console.error(
        "Order Tracking Error:",
        err
      );

      setError(
        "Unable to load order details."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  // ==========================================
  // AUTO REFRESH
  // ==========================================

  useEffect(() => {
    if (!orderId) return;

    const interval = setInterval(() => {
      loadOrder();
    }, 10000);

    return () => clearInterval(interval);
  }, [orderId]);

  // ==========================================
  // STATUS
  // ==========================================

  const statusSteps = [
    {
      key: "PLACED",
      title: "Order Placed",
      description:
        "Your order has been received",
      icon: "bi-receipt",
    },
    {
      key: "CONFIRMED",
      title: "Order Confirmed",
      description:
        "Restaurant confirmed your order",
      icon: "bi-check-circle",
    },
    {
      key: "PREPARING",
      title: "Preparing",
      description:
        "Your food is being prepared",
      icon: "bi-egg-fried",
    },
    {
      key: "OUT_FOR_DELIVERY",
      title: "Out for Delivery",
      description:
        "Your order is on the way",
      icon: "bi-bicycle",
    },
    {
      key: "DELIVERED",
      title: "Delivered",
      description:
        "Order delivered successfully",
      icon: "bi-house-check",
    },
  ];

  const getCurrentStep = () => {
    const currentStatus =
      order?.orderStatus?.toUpperCase();

    const index = statusSteps.findIndex(
      (step) => step.key === currentStatus
    );

    return index >= 0 ? index : 0;
  };

  const currentStep = getCurrentStep();

  // ==========================================
  // STATUS TEXT
  // ==========================================

  const getStatusText = (status) => {
    switch (status?.toUpperCase()) {
      case "PLACED":
        return "Order Placed";

      case "CONFIRMED":
        return "Order Confirmed";

      case "PREPARING":
        return "Preparing";

      case "OUT_FOR_DELIVERY":
        return "Out for Delivery";

      case "DELIVERED":
        return "Delivered";

      case "CANCELLED":
        return "Cancelled";

      default:
        return status || "Placed";
    }
  };

  // ==========================================
  // DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="order-tracking-page">

        <div className="tracking-loading">

          <div className="loading-spinner"></div>

          <p>
            Loading order details...
          </p>

        </div>

      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error || !order) {
    return (
      <div className="order-tracking-page">

        <div className="tracking-error">

          <div className="tracking-error-icon">
            <i className="bi bi-exclamation-circle"></i>
          </div>

          <h2>
            Unable to Load Order
          </h2>

          <p>
            {error ||
              "Order details are unavailable."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/orders")}
          >
            <i className="bi bi-arrow-left"></i>
            Back to Orders
          </button>

        </div>

      </div>
    );
  }

  // ==========================================
  // CANCELLED ORDER
  // ==========================================

  const isCancelled =
    order.orderStatus?.toUpperCase() ===
    "CANCELLED";

  // ==========================================
  // MAIN
  // ==========================================

  return (
    <div className="order-tracking-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="tracking-header">

        <div>

          <h1>
            <i className="bi bi-geo-alt"></i>
            Track Your Order
          </h1>

          <p>
            Track your Savor Dine order in real time
          </p>

        </div>

        <button
          type="button"
          className="tracking-refresh-btn"
          onClick={loadOrder}
        >
          <i className="bi bi-arrow-clockwise"></i>
          Refresh
        </button>

      </div>

      {/* ======================================
          ORDER SUMMARY
      ====================================== */}

      <div className="tracking-order-card">

        <div className="tracking-order-header">

          <div>

            <span>
              Order ID
            </span>

            <h2>
              #{order.id}
            </h2>

          </div>

          <div
            className={`tracking-status ${
              isCancelled
                ? "tracking-cancelled"
                : ""
            }`}
          >
            <span className="tracking-status-dot"></span>

            {getStatusText(
              order.orderStatus
            )}
          </div>

        </div>

        <div className="tracking-order-info">

          <div>
            <i className="bi bi-calendar3"></i>

            <span>
              Ordered On
            </span>

            <strong>
              {formatDate(order.orderDate)}
            </strong>
          </div>

          <div>
            <i className="bi bi-credit-card"></i>

            <span>
              Payment
            </span>

            <strong>
              {order.paymentStatus ||
                "PENDING"}
            </strong>
          </div>

          <div>
            <i className="bi bi-currency-rupee"></i>

            <span>
              Total
            </span>

            <strong>
              ₹
              {Number(
                order.totalAmount || 0
              ).toLocaleString("en-IN")}
            </strong>
          </div>

        </div>

      </div>

      {/* ======================================
          TRACKING STEPS
      ====================================== */}

      {!isCancelled && (
        <div className="tracking-card">

          <div className="tracking-card-header">

            <div>

              <h2>
                Order Status
              </h2>

              <p>
                Your order progress
              </p>

            </div>

            <span className="live-badge">
              <span></span>
              Live
            </span>

          </div>

          <div className="tracking-timeline">

            {statusSteps.map(
              (step, index) => {

                const completed =
                  index < currentStep;

                const active =
                  index === currentStep;

                return (
                  <div
                    className={`tracking-step ${
                      completed
                        ? "completed"
                        : ""
                    } ${
                      active
                        ? "active"
                        : ""
                    }`}
                    key={step.key}
                  >

                    <div className="step-icon">

                      <i
                        className={`bi ${step.icon}`}
                      ></i>

                    </div>

                    <div className="step-content">

                      <h3>
                        {step.title}
                      </h3>

                      <p>
                        {step.description}
                      </p>

                      {active && (
                        <span className="current-label">
                          Current Status
                        </span>
                      )}

                    </div>

                    {index <
                      statusSteps.length - 1 && (
                      <div
                        className={`step-line ${
                          completed
                            ? "completed-line"
                            : ""
                        }`}
                      ></div>
                    )}

                  </div>
                );
              }
            )}

          </div>

        </div>
      )}

      {/* ======================================
          CANCELLED MESSAGE
      ====================================== */}

      {isCancelled && (
        <div className="cancelled-order-card">

          <div className="cancelled-icon">
            <i className="bi bi-x-circle"></i>
          </div>

          <div>

            <h2>
              Order Cancelled
            </h2>

            <p>
              This order has been cancelled.
            </p>

          </div>

        </div>
      )}

      {/* ======================================
          DELIVERY ADDRESS
      ====================================== */}

      <div className="tracking-details-grid">

        <div className="tracking-detail-card">

          <div className="detail-card-title">

            <i className="bi bi-geo-alt"></i>

            <div>
              <h2>
                Delivery Address
              </h2>

              <p>
                Your order will be delivered here
              </p>
            </div>

          </div>

          <div className="address-box">

            <i className="bi bi-house"></i>

            <span>
              {order.deliveryAddress ||
                "Address unavailable"}
            </span>

          </div>

        </div>

        {/* ====================================
            ORDER ITEMS
        ==================================== */}

        <div className="tracking-detail-card">

          <div className="detail-card-title">

            <i className="bi bi-bag"></i>

            <div>
              <h2>
                Order Items
              </h2>

              <p>
                Items included in this order
              </p>
            </div>

          </div>

          <div className="tracking-items">

            {items.length > 0 ? (
              items.map((item) => (

                <div
                  className="tracking-item"
                  key={item.id}
                >

                  <div className="tracking-item-icon">
                    <i className="bi bi-egg-fried"></i>
                  </div>

                  <div className="tracking-item-info">

                    <strong>
                      {item.food?.name ||
                        "Food Item"}
                    </strong>

                    <span>
                      Quantity: {item.quantity}
                    </span>

                  </div>

                  <strong className="tracking-item-price">
                    ₹
                    {(
                      Number(item.price || 0) *
                      Number(item.quantity || 0)
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>

              ))
            ) : (
              <p className="no-items">
                No item details available.
              </p>
            )}

          </div>

        </div>

      </div>

      {/* ======================================
          ACTIONS
      ====================================== */}

      <div className="tracking-actions">

        <button
          type="button"
          className="back-orders-btn"
          onClick={() => navigate("/orders")}
        >
          <i className="bi bi-arrow-left"></i>
          My Orders
        </button>

        <button
          type="button"
          className="continue-shopping-btn"
          onClick={() => navigate("/menu")}
        >
          <i className="bi bi-shop"></i>
          Continue Shopping
        </button>

      </div>

    </div>
  );
};

export default OrderTracking;