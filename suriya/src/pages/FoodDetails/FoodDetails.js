import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./FoodDetails.css";

const FoodDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Menu page la irundhu food data varum
  const food = location.state?.food;

  // Direct URL open pannina fallback
  const defaultFood = {
    name: "Chicken Biryani",
    category: "Main Course",
    price: 180,
    rating: 4.8,
    reviews: 124,

    // Correct image path
    image: require("../../assets/images/lunch/Chicken Biryani.png"),

    description:
      "Aromatic basmati rice cooked with tender chicken, rich spices and fresh herbs. A delicious and satisfying classic made with authentic flavors.",
  };

  const item = food || defaultFood;

  // Quantity
  const [quantity, setQuantity] = useState(1);

  // Increase quantity
  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  // Decrease quantity
  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  // Add to cart
  const handleAddToCart = () => {
    const existingCart =
      JSON.parse(localStorage.getItem("cartItems")) || [];

    const existingItem = existingCart.find(
      (cartItem) => cartItem.name === item.name
    );

    let updatedCart;

    if (existingItem) {
      updatedCart = existingCart.map((cartItem) =>
        cartItem.name === item.name
          ? {
              ...cartItem,
              quantity: (cartItem.quantity || 1) + quantity,
            }
          : cartItem
      );
    } else {
      updatedCart = [
        ...existingCart,
        {
          ...item,
          quantity: quantity,
        },
      ];
    }

    localStorage.setItem(
      "cartItems",
      JSON.stringify(updatedCart)
    );

    alert("Item added to cart!");
  };

  // Buy Now
  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  return (
    <div className="food-details-page">
      <div className="food-details-container">

        {/* Back Button */}
        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          ← Back to Menu
        </button>

        {/* Main Food Details Card */}
        <div className="food-details-card">

          {/* Food Image */}
          <div className="food-image-section">
            <div className="image-wrapper">
              <img
                src={item.image}
                alt={item.name}
                className="food-details-image"
              />
            </div>

            <div className="image-badge">
              ⭐ {item.rating || 4.8}
            </div>
          </div>

          {/* Food Information */}
          <div className="food-info-section">

            {/* Category */}
            <span className="food-category">
              {item.category || "Food"}
            </span>

            {/* Food Name */}
            <h1>{item.name}</h1>

            {/* Rating */}
            <div className="food-rating">
              <span className="stars">
                ★★★★★
              </span>

              <span className="rating-number">
                {item.rating || 4.8}
              </span>

              <span className="review-count">
                ({item.reviews || 124} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="food-price">
              ₹{item.price}
            </div>

            {/* Description */}
            <p className="food-description">
              {item.description ||
                "Freshly prepared with premium ingredients and authentic flavors. Perfect for enjoying a delicious and satisfying meal."}
            </p>

            {/* About This Dish */}
            <div className="details-section">
              <h3>About this dish</h3>

              <div className="feature-list">

                <div className="feature-item">
                  <span>🍽️</span>
                  <p>Freshly Prepared</p>
                </div>

                <div className="feature-item">
                  <span>🌿</span>
                  <p>Quality Ingredients</p>
                </div>

                <div className="feature-item">
                  <span>🔥</span>
                  <p>Served Hot</p>
                </div>

              </div>
            </div>

            {/* Quantity */}
            <div className="quantity-section">
              <span>Quantity</span>

              <div className="quantity-box">

                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={quantity === 1}
                >
                  -
                </button>

                <span>{quantity}</span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                >
                  +
                </button>

              </div>
            </div>

            {/* Action Buttons */}
            <div className="food-actions">

              <button
                type="button"
                className="add-cart-btn"
                onClick={handleAddToCart}
              >
                🛒 Add to Cart
              </button>

              <button
                type="button"
                className="buy-now-btn"
                onClick={handleBuyNow}
              >
                Buy Now
              </button>

            </div>

          </div>
        </div>

        {/* Bottom Information */}
        <div className="food-extra-info">

          {/* Fast Delivery */}
          <div className="extra-card">
            <div className="extra-icon">
              🚚
            </div>

            <div>
              <h4>Fast Delivery</h4>

              <p>
                Delivered fresh and hot to your doorstep.
              </p>
            </div>
          </div>

          {/* Fresh Ingredients */}
          <div className="extra-card">
            <div className="extra-icon">
              🥗
            </div>

            <div>
              <h4>Fresh Ingredients</h4>

              <p>
                Made using carefully selected ingredients.
              </p>
            </div>
          </div>

          {/* Secure Payment */}
          <div className="extra-card">
            <div className="extra-icon">
              💳
            </div>

            <div>
              <h4>Secure Payment</h4>

              <p>
                Safe and secure payment experience.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default FoodDetails;