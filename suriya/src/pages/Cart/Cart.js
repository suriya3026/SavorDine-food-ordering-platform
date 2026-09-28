import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

import {
  getCartItems,
  updateCartQuantity,
  removeFromCart,
  clearCart,
} from "../../Services/cartService";

const Cart = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // GET LOGGED-IN USER
  // ==========================================

  const userId = localStorage.getItem("userId");

  // ==========================================
  // LOAD CART
  // ==========================================

  const loadCart = async () => {
    if (!userId) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getCartItems(userId);

      setCartItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Cart Load Error:", err);

      setError("Unable to load cart. Please try again.");
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadCart();
  }, [userId]);

  // ==========================================
  // INCREASE QUANTITY
  // ==========================================

  const increaseQuantity = async (item) => {
    try {
      setActionLoading(true);

      await updateCartQuantity(
        userId,
        item.food.id,
        item.quantity + 1
      );

      await loadCart();
    } catch (err) {
      console.error("Increase Quantity Error:", err);
      alert("Unable to update quantity.");
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // DECREASE QUANTITY
  // ==========================================

  const decreaseQuantity = async (item) => {
    if (item.quantity <= 1) {
      await handleRemove(item.food.id);
      return;
    }

    try {
      setActionLoading(true);

      await updateCartQuantity(
        userId,
        item.food.id,
        item.quantity - 1
      );

      await loadCart();
    } catch (err) {
      console.error("Decrease Quantity Error:", err);
      alert("Unable to update quantity.");
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // REMOVE ITEM
  // ==========================================

  const handleRemove = async (foodId) => {
    try {
      setActionLoading(true);

      await removeFromCart(userId, foodId);

      await loadCart();
    } catch (err) {
      console.error("Remove Cart Error:", err);
      alert("Unable to remove item.");
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // CLEAR CART
  // ==========================================

  const handleClearCart = async () => {
    if (cartItems.length === 0) return;

    const confirmClear = window.confirm(
      "Are you sure you want to clear your cart?"
    );

    if (!confirmClear) return;

    try {
      setActionLoading(true);

      await clearCart(userId);

      setCartItems([]);
    } catch (err) {
      console.error("Clear Cart Error:", err);
      alert("Unable to clear cart.");
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // TOTAL CALCULATION
  // ==========================================

  const totalAmount = cartItems.reduce((total, item) => {
    const price = Number(item.food?.price || 0);
    const quantity = Number(item.quantity || 0);

    return total + price * quantity;
  }, 0);

  // ==========================================
  // CHECKOUT
  // ==========================================

  const handleCheckout = () => {
    if (!userId) {
      alert("Please login to continue.");
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    navigate("/checkout");
  };

  // ==========================================
  // LOGIN CHECK
  // ==========================================

  if (!userId) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <div className="empty-cart-icon">
            🛒
          </div>

          <h2>Please Login</h2>

          <p>
            Login to view your cart and place an order.
          </p>

          <button
            className="continue-shopping-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="cart-page">
        <div className="cart-loading">
          <div className="loading-spinner"></div>
          <p>Loading your cart...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div className="cart-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="cart-header">

        <div>
          <h1>
            <i className="bi bi-cart3"></i>{" "}
            Your Cart
          </h1>

          <p>
            Review your selected food items
          </p>
        </div>

        {cartItems.length > 0 && (
          <button
            className="clear-cart-btn"
            onClick={handleClearCart}
            disabled={actionLoading}
          >
            <i className="bi bi-trash3"></i>
            Clear Cart
          </button>
        )}

      </div>

      {/* ======================================
          ERROR
      ====================================== */}

      {error && (
        <div className="cart-error">
          <i className="bi bi-exclamation-circle"></i>
          {error}
        </div>
      )}

      {/* ======================================
          EMPTY CART
      ====================================== */}

      {cartItems.length === 0 ? (

        <div className="empty-cart">

          <div className="empty-cart-icon">
            <i className="bi bi-cart-x"></i>
          </div>

          <h2>Your Cart is Empty</h2>

          <p>
            Looks like you haven't added anything to
            your cart yet.
          </p>

          <button
            className="continue-shopping-btn"
            onClick={() => navigate("/menu")}
          >
            <i className="bi bi-arrow-left"></i>
            Continue Shopping
          </button>

        </div>

      ) : (

        <div className="cart-layout">

          {/* ====================================
              CART ITEMS
          ==================================== */}

          <div className="cart-items-section">

            <div className="cart-items-header">
              <h2>
                Cart Items
              </h2>

              <span>
                {cartItems.length} item
                {cartItems.length !== 1 ? "s" : ""}
              </span>
            </div>

            {cartItems.map((item) => {

              const food = item.food;

              const itemTotal =
                Number(food?.price || 0) *
                Number(item.quantity || 0);

              return (
                <div
                  className="cart-item"
                  key={item.id}
                >

                  {/* FOOD IMAGE */}

                  <div className="cart-item-image">

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

                  {/* FOOD DETAILS */}

                  <div className="cart-item-details">

                    <h3>
                      {food?.name || "Food Item"}
                    </h3>

                    <p>
                      {food?.description ||
                        "Delicious food from Savor Dine"}
                    </p>

                    <span className="item-price">
                      ₹
                      {Number(
                        food?.price || 0
                      ).toLocaleString("en-IN")}
                    </span>

                  </div>

                  {/* QUANTITY */}

                  <div className="quantity-section">

                    <span className="quantity-label">
                      Quantity
                    </span>

                    <div className="quantity-control">

                      <button
                        type="button"
                        onClick={() =>
                          decreaseQuantity(item)
                        }
                        disabled={actionLoading}
                      >
                        <i className="bi bi-dash"></i>
                      </button>

                      <span>
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          increaseQuantity(item)
                        }
                        disabled={actionLoading}
                      >
                        <i className="bi bi-plus"></i>
                      </button>

                    </div>

                  </div>

                  {/* ITEM TOTAL */}

                  <div className="cart-item-total">

                    <span>
                      ₹
                      {itemTotal.toLocaleString(
                        "en-IN"
                      )}
                    </span>

                  </div>

                  {/* REMOVE */}

                  <button
                    type="button"
                    className="remove-item-btn"
                    onClick={() =>
                      handleRemove(food?.id)
                    }
                    disabled={actionLoading}
                    title="Remove item"
                  >
                    <i className="bi bi-trash3"></i>
                  </button>

                </div>
              );
            })}

          </div>

          {/* ====================================
              ORDER SUMMARY
          ==================================== */}

          <div className="cart-summary">

            <div className="summary-header">
              <h2>Order Summary</h2>
            </div>

            <div className="summary-row">
              <span>Items</span>

              <span>
                {cartItems.reduce(
                  (total, item) =>
                    total +
                    Number(item.quantity || 0),
                  0
                )}
              </span>
            </div>

            <div className="summary-row">
              <span>Subtotal</span>

              <span>
                ₹
                {totalAmount.toLocaleString(
                  "en-IN"
                )}
              </span>
            </div>

            <div className="summary-row">
              <span>Delivery Fee</span>

              <span className="free-text">
                FREE
              </span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">

              <span>Total</span>

              <strong>
                ₹
                {totalAmount.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            <button
              type="button"
              className="checkout-btn"
              onClick={handleCheckout}
              disabled={actionLoading}
            >
              Proceed to Checkout
              <i className="bi bi-arrow-right"></i>
            </button>

            <button
              type="button"
              className="continue-menu-btn"
              onClick={() => navigate("/menu")}
            >
              <i className="bi bi-arrow-left"></i>
              Continue Shopping
            </button>

          </div>

        </div>
      )}

    </div>
  );
};

export default Cart;