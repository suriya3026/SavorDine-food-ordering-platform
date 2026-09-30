import React, { useState } from "react";
import "./Offers.css";

const Offers = () => {
  const [copiedCode, setCopiedCode] = useState("");

  const offers = [
    {
      id: 1,
      title: "Welcome Offer",
      description: "Get a special discount on your first order.",
      discount: "20% OFF",
      code: "WELCOME20",
      minOrder: "Minimum order ₹299",
      icon: "bi-gift",
    },
    {
      id: 2,
      title: "Foodie Special",
      description: "Enjoy delicious food with an exclusive discount.",
      discount: "15% OFF",
      code: "FOODIE15",
      minOrder: "Minimum order ₹499",
      icon: "bi-egg-fried",
    },
    {
      id: 3,
      title: "Weekend Treat",
      description: "Make your weekend delicious with Savor Dine.",
      discount: "25% OFF",
      code: "WEEKEND25",
      minOrder: "Minimum order ₹599",
      icon: "bi-calendar-heart",
    },
    {
      id: 4,
      title: "Special Savings",
      description: "Save more on your favorite Savor Dine meals.",
      discount: "₹100 OFF",
      code: "SAVE100",
      minOrder: "Minimum order ₹699",
      icon: "bi-tag",
    },
  ];

  const copyCode = async (code) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = code;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      setCopiedCode(code);

      setTimeout(() => {
        setCopiedCode("");
      }, 2000);
    } catch (error) {
      console.error("Copy Error:", error);
    }
  };

  return (
    <div className="offers-page">

      {/* HEADER */}
      <div className="offers-header">
        <div className="offers-header-content">
          <h1>
            <i className="bi bi-percent"></i>
            <span>Offers & Deals</span>
          </h1>

          <p>
            Save more on your favorite Savor Dine meals
          </p>
        </div>

        <div className="offers-header-icon">
          <i className="bi bi-gift"></i>
        </div>
      </div>

      {/* OFFER BANNER */}
      <div className="offers-banner">
        <div className="banner-content">
          <span className="banner-small-text">
            SPECIAL OFFER
          </span>

          <h2>
            Delicious Food,
            <br />
            Amazing Savings!
          </h2>

          <p>
            Use our exclusive promo codes and enjoy
            great discounts on your orders.
          </p>
        </div>

        <div className="banner-icon">
          <i className="bi bi-stars"></i>
        </div>
      </div>

      {/* OFFERS SECTION */}
      <div className="offers-section">

        <div className="section-title">
          <div>
            <h2>Available Offers</h2>

            <p>
              Choose an offer and start saving
            </p>
          </div>

          <span>
            {offers.length} Offers
          </span>
        </div>

        {/* OFFERS GRID */}
        <div className="offers-grid">
          {offers.map((offer) => {
            const isCopied = copiedCode === offer.code;

            return (
              <div
                className="offer-card"
                key={offer.id}
              >

                {/* CARD TOP */}
                <div className="offer-card-top">
                  <div className="offer-icon">
                    <i className={`bi ${offer.icon}`}></i>
                  </div>

                  <span className="discount-badge">
                    {offer.discount}
                  </span>
                </div>

                {/* CARD CONTENT */}
                <div className="offer-content">
                  <h3>{offer.title}</h3>

                  <p>{offer.description}</p>

                  <span className="minimum-order">
                    <i className="bi bi-info-circle"></i>
                    <span>{offer.minOrder}</span>
                  </span>
                </div>

                {/* PROMO CODE */}
                <div className="offer-code-section">

                  <div
                    className="promo-code"
                    title={offer.code}
                  >
                    {offer.code}
                  </div>

                  <button
                    type="button"
                    className={`copy-code-btn ${
                      isCopied ? "copied" : ""
                    }`}
                    onClick={() => copyCode(offer.code)}
                    aria-label={`Copy ${offer.code}`}
                  >
                    <i
                      className={`bi ${
                        isCopied
                          ? "bi-check-lg"
                          : "bi-copy"
                      }`}
                    ></i>

                    <span>
                      {isCopied ? "Copied" : "Copy"}
                    </span>
                  </button>

                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* HOW TO USE */}
      <div className="how-to-use">

        <div className="how-to-header">
          <i className="bi bi-question-circle"></i>

          <div>
            <h2>How to Use an Offer</h2>

            <p>
              Follow these simple steps
            </p>
          </div>
        </div>

        <div className="steps-grid">

          <div className="offer-step">
            <span>01</span>

            <div>
              <h3>Choose an Offer</h3>

              <p>
                Select your favorite discount from
                the available offers.
              </p>
            </div>
          </div>

          <div className="offer-step">
            <span>02</span>

            <div>
              <h3>Copy Promo Code</h3>

              <p>
                Copy the promo code and keep it ready
                for checkout.
              </p>
            </div>
          </div>

          <div className="offer-step">
            <span>03</span>

            <div>
              <h3>Place Your Order</h3>

              <p>
                Add your favorite food and continue
                to checkout.
              </p>
            </div>
          </div>

          <div className="offer-step">
            <span>04</span>

            <div>
              <h3>Enjoy Your Savings</h3>

              <p>
                Apply your code and enjoy your
                delicious meal.
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Offers;