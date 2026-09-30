import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

import { getCartItems } from "../../Services/cartService";
import { createOrder } from "../../Services/orderService";

const Checkout = () => {
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  const [cartItems, setCartItems] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD CART
  // ==========================================

  const loadCart = async () => {
    if (!userId) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getCartItems(userId);

      if (!Array.isArray(data) || data.length === 0) {
        navigate("/cart");
        return;
      }

      setCartItems(data);
    } catch (err) {
      console.error("Checkout Cart Error:", err);
      setError("Unable to load your cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // ==========================================
  // TOTAL
  // ==========================================

  const totalAmount = cartItems.reduce((total, item) => {
    const price = Number(item.food?.price || 0);
    const quantity = Number(item.quantity || 0);

    return total + price * quantity;
  }, 0);

  // ==========================================
  // PLACE ORDER
  // ==========================================

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("Please login to continue.");
      navigate("/login");
      return;
    }

    if (!deliveryAddress.trim()) {
      alert("Please enter your delivery address.");
      return;
    }

    try {
      setPlacingOrder(true);
      setError("");

      const order = await createOrder(
        userId,
        deliveryAddress.trim()
      );

      console.log("Order Created:", order);

      // Save latest order ID for success/tracking page
      if (order?.id) {
        localStorage.setItem("lastOrderId", order.id);
      }

      // Go to success page
      navigate("/orderssuccess", {
        state: {
          orderId: order?.id,
          totalAmount: order?.totalAmount || totalAmount,
        },
      });
    } catch (err) {
      console.error("Place Order Error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to place order. Please try again."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="checkout-page">
        <div className="checkout-loading">
          <div className="loading-spinner"></div>
          <p>Loading checkout...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN
  // ==========================================

  return (
    <div className="checkout-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="checkout-header">

        <div>
          <h1>
            <i className="bi bi-bag-check"></i>{" "}
            Checkout
          </h1>

          <p>
            Complete your order with Savor Dine
          </p>
        </div>

        <button
          type="button"
          className="back-cart-btn"
          onClick={() => navigate("/cart")}
        >
          <i className="bi bi-arrow-left"></i>
          Back to Cart
        </button>

      </div>

      {/* ======================================
          ERROR
      ====================================== */}

      {error && (
        <div className="checkout-error">
          <i className="bi bi-exclamation-circle"></i>
          {error}
        </div>
      )}

      <div className="checkout-layout">

        {/* ====================================
            DELIVERY DETAILS
        ==================================== */}

        <div className="checkout-form-section">

          <div className="checkout-card">

            <div className="checkout-card-header">
              <div className="checkout-icon">
                <i className="bi bi-geo-alt"></i>
              </div>

              <div>
                <h2>Delivery Address</h2>
                <p>
                  Where should we deliver your order?
                </p>
              </div>
            </div>

            <form onSubmit={handlePlaceOrder}>

              <div className="form-group">

                <label htmlFor="deliveryAddress">
                  Delivery Address
                </label>

                <textarea
                  id="deliveryAddress"
                  value={deliveryAddress}
                  onChange={(e) =>
                    setDeliveryAddress(e.target.value)
                  }
                  placeholder="Enter your complete delivery address"
                  rows="5"
                  required
                />

              </div>

              <div className="delivery-note">
                <i className="bi bi-info-circle"></i>

                <span>
                  Please provide a complete address
                  including house number, street,
                  area and city.
                </span>
              </div>

              {/* ==================================
                  PAYMENT
              ================================== */}

              <div className="payment-section">

                <div className="checkout-card-header">

                  <div className="checkout-icon">
                    <i className="bi bi-credit-card"></i>
                  </div>

                  <div>
                    <h2>Payment Method</h2>
                    <p>
                      Select your payment option
                    </p>
                  </div>

                </div>

                <div className="payment-option active">

                  <div className="payment-radio">
                    <input
                      type="radio"
                      checked
                      readOnly
                    />
                  </div>

                  <div className="payment-content">

                    <strong>
                      Cash on Delivery
                    </strong>

                    <span>
                      Pay when your order arrives
                    </span>

                  </div>

                  <i className="bi bi-cash-stack"></i>

                </div>

              </div>

              <button
                type="submit"
                className="place-order-btn"
                disabled={placingOrder}
              >

                {placingOrder ? (
                  <>
                    <span className="button-spinner"></span>
                    Placing Order...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle"></i>
                    Place Order
                  </>
                )}

              </button>

            </form>

          </div>

        </div>

        {/* ====================================
            ORDER SUMMARY
        ==================================== */}

        <div className="checkout-summary">

          <div className="summary-card">

            <div className="summary-card-header">
              <h2>Order Summary</h2>

              <span>
                {cartItems.length} item
                {cartItems.length !== 1
                  ? "s"
                  : ""}
              </span>
            </div>

            {/* ITEMS */}

            <div className="checkout-items">

              {cartItems.map((item) => {

                const food = item.food;

                const itemTotal =
                  Number(food?.price || 0) *
                  Number(item.quantity || 0);

                return (
                  <div
                    className="checkout-item"
                    key={item.id}
                  >

                    <div className="checkout-item-image">

                      <img
                        src={
                          food?.image ||
                          "/assets/images/background.png"
                        }
                        alt={food?.name || "Food"}
                        onError={(e) => {
                          e.target.src =
                            "/assets/images/background.png";
                        }}
                      />

                    </div>

                    <div className="checkout-item-info">

                      <h4>
                        {food?.name ||
                          "Food Item"}
                      </h4>

                      <span>
                        Qty: {item.quantity}
                      </span>

                    </div>

                    <strong>
                      ₹
                      {itemTotal.toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                  </div>
                );
              })}

            </div>

            <div className="summary-divider"></div>

            {/* SUBTOTAL */}

            <div className="summary-row">

              <span>Subtotal</span>

              <span>
                ₹
                {totalAmount.toLocaleString(
                  "en-IN"
                )}
              </span>

            </div>

            {/* DELIVERY */}

            <div className="summary-row">

              <span>Delivery Fee</span>

              <span className="free-text">
                FREE
              </span>

            </div>

            <div className="summary-divider"></div>

            {/* TOTAL */}

            <div className="summary-total">

              <span>Total Amount</span>

              <strong>
                ₹
                {totalAmount.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

          </div>

          {/* SECURITY */}

          <div className="secure-checkout">

            <i className="bi bi-shield-check"></i>

            <div>
              <strong>Secure Checkout</strong>

              <span>
                Your order information is securely
                processed.
              </span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Checkout;