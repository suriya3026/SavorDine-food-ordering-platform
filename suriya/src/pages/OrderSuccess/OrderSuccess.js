import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./OrderSuccess.css";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const orderId =
    location.state?.orderId ||
    localStorage.getItem("lastOrderId");

  const totalAmount =
    location.state?.totalAmount || 0;

  return (
    <div className="order-success-page">

      <div className="success-card">

        {/* SUCCESS ICON */}

        <div className="success-icon">
          <i className="bi bi-check-lg"></i>
        </div>

        {/* TITLE */}

        <h1>Order Placed Successfully!</h1>

        <p className="success-message">
          Thank you for ordering with Savor Dine.
          Your delicious food is being prepared.
        </p>

        {/* ORDER DETAILS */}

        <div className="success-details">

          <div className="success-detail-item">
            <span>
              <i className="bi bi-receipt"></i>
              Order ID
            </span>

            <strong>
              #{orderId || "N/A"}
            </strong>
          </div>

          <div className="success-detail-item">
            <span>
              <i className="bi bi-cash-stack"></i>
              Payment
            </span>

            <strong>
              Cash on Delivery
            </strong>
          </div>

          {totalAmount > 0 && (
            <div className="success-detail-item">
              <span>
                <i className="bi bi-currency-rupee"></i>
                Total Amount
              </span>

              <strong>
                ₹
                {Number(totalAmount).toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>
          )}

          <div className="success-detail-item">
            <span>
              <i className="bi bi-clock"></i>
              Status
            </span>

            <strong className="placed-status">
              Placed
            </strong>
          </div>

        </div>

        {/* MESSAGE */}

        <div className="delivery-message">

          <i className="bi bi-bicycle"></i>

          <div>
            <strong>
              Your order is on the way to preparation!
            </strong>

            <p>
              You can track your order from the
              Orders section.
            </p>
          </div>

        </div>

        {/* BUTTONS */}

        <div className="success-actions">

          <button
            type="button"
            className="track-order-btn"
            onClick={() => {
              if (orderId) {
                navigate("/order-tracking", {
                  state: {
                    orderId: orderId,
                  },
                });
              } else {
                navigate("/orders");
              }
            }}
          >
            <i className="bi bi-geo-alt"></i>
            Track Order
          </button>

          <button
            type="button"
            className="view-orders-btn"
            onClick={() => navigate("/orders")}
          >
            <i className="bi bi-bag"></i>
            View My Orders
          </button>

          <button
            type="button"
            className="continue-shopping-btn"
            onClick={() => navigate("/menu")}
          >
            <i className="bi bi-arrow-left"></i>
            Continue Shopping
          </button>

        </div>

      </div>

    </div>
  );
};

export default OrderSuccess;