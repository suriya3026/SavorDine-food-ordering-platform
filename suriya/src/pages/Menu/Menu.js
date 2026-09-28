import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Menu.css";

import api from "../../Services/api";

// =====================================================
// USER ID HELPER
// =====================================================

const getUserId = () => {
  const savedUserId = localStorage.getItem("userId");

  if (savedUserId) {
    return savedUserId;
  }

  try {
    const user = JSON.parse(
      localStorage.getItem("user") || "null"
    );

    return user?.id || null;
  } catch {
    return null;
  }
};

const Menu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [foods, setFoods] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");

  const [cartCount, setCartCount] = useState(0);
  const [addingFood, setAddingFood] = useState(null);

  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("favoriteFoods") || "[]"
      );
    } catch {
      return [];
    }
  });

  // =====================================================
  // BACKEND IMAGE HELPER
  // =====================================================

  const getFoodImage = (food) => {
    if (!food?.image) {
      return "";
    }

    if (
      food.image.startsWith("http://") ||
      food.image.startsWith("https://")
    ) {
      return food.image;
    }

    if (food.image.startsWith("/")) {
      return `http://localhost:8080${food.image}`;
    }

    return `http://localhost:8080/uploads/${food.image}`;
  };

  // =====================================================
  // NORMALIZE SEARCH
  // =====================================================

  const normalizeSearch = (value) => {
    return String(value || "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");
  };

  // =====================================================
  // LOAD FOODS
  // =====================================================

  const loadFoods = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/foods");

      const data = Array.isArray(response.data)
        ? response.data
        : [];

      setFoods(data);
    } catch (err) {
      console.error("Food loading error:", err);

      setError(
        "Menu is temporarily unavailable. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD CART COUNT
  // =====================================================

  const loadCartCount = useCallback(async () => {
    const userId = getUserId();

    if (!userId) {
      setCartCount(0);
      return;
    }

    try {
      const response = await api.get(
        `/cart/${userId}`
      );

      const items = Array.isArray(response.data)
        ? response.data
        : [];

      const count = items.reduce(
        (total, item) =>
          total + Number(item.quantity || 0),
        0
      );

      setCartCount(count);
    } catch (err) {
      console.error(
        "Cart count loading error:",
        err
      );

      setCartCount(0);
    }
  }, []);

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadFoods();
    loadCartCount();
  }, [loadCartCount]);

  // =====================================================
  // CART EVENT
  // =====================================================

  useEffect(() => {
    const handleCartUpdate = () => {
      loadCartCount();
    };

    window.addEventListener(
      "cartUpdated",
      handleCartUpdate
    );

    return () => {
      window.removeEventListener(
        "cartUpdated",
        handleCartUpdate
      );
    };
  }, [loadCartCount]);

  // =====================================================
  // FILTER + SEARCH + SORT
  // =====================================================

  const filteredFoods = useMemo(() => {
    let result = [...foods];

    // ===================================================
    // SEARCH
    // ===================================================

    if (search.trim()) {
      const keyword = normalizeSearch(search);

      result = result.filter((food) => {
        const name = normalizeSearch(
          food.name
        );

        const description = normalizeSearch(
          food.description
        );

        return (
          name.includes(keyword) ||
          description.includes(keyword)
        );
      });
    }

    // ===================================================
    // SORT
    // ===================================================

    if (sortBy === "low") {
      result.sort(
        (a, b) =>
          Number(a.price || 0) -
          Number(b.price || 0)
      );
    }

    if (sortBy === "high") {
      result.sort(
        (a, b) =>
          Number(b.price || 0) -
          Number(a.price || 0)
      );
    }

    if (sortBy === "name") {
      result.sort((a, b) =>
        String(a.name || "").localeCompare(
          String(b.name || "")
        )
      );
    }

    return result;
  }, [
    foods,
    search,
    sortBy,
  ]);

  // =====================================================
  // ADD TO CART
  // =====================================================

  const handleAddToCart = async (food) => {
    const userId = getUserId();

    if (!userId) {
      alert(
        "Please login before adding food to cart."
      );

      navigate("/login");
      return;
    }

    if (!food?.id) {
      alert(
        "This food item does not have a valid backend ID."
      );
      return;
    }

    if (food.available === false) {
      alert(
        "This food is currently unavailable."
      );
      return;
    }

    try {
      setAddingFood(food.id);

      await api.post("/cart/add", {
        userId: Number(userId),
        foodId: Number(food.id),
        quantity: 1,
      });

      await loadCartCount();

      window.dispatchEvent(
        new Event("cartUpdated")
      );

      alert(
        `${food.name} added to cart successfully!`
      );
    } catch (err) {
      console.error(
        "Add to cart error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Unable to add food to cart."
      );
    } finally {
      setAddingFood(null);
    }
  };

  // =====================================================
  // FAVORITE
  // =====================================================

  const toggleFavorite = (foodId) => {
    let updated = [...favorites];

    if (updated.includes(foodId)) {
      updated = updated.filter(
        (id) => id !== foodId
      );
    } else {
      updated.push(foodId);
    }

    setFavorites(updated);

    localStorage.setItem(
      "favoriteFoods",
      JSON.stringify(updated)
    );
  };

  // =====================================================
  // FOOD DETAILS
  // =====================================================

  const handleFoodClick = (food) => {
    if (!food?.id) return;

    navigate(`/food/${food.id}`);
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <main className="menu-page">

      {/* =================================================
          TOP HEADER
      ================================================= */}

      <section className="menu-hero">

        <div className="menu-hero-content">

          <span className="menu-kicker">
            <i className="bi bi-egg-fried"></i>
            SAVOR DINE MENU
          </span>

          <h1>
            Delicious food,
            <span> made for you.</span>
          </h1>

          <p>
            Explore our freshly prepared dishes
            and order your favorites anytime.
          </p>

        </div>

        <button
          type="button"
          className="menu-cart-button"
          onClick={() => navigate("/cart")}
        >
          <i className="bi bi-cart3"></i>

          <span>
            Cart
          </span>

          {cartCount > 0 && (
            <b>{cartCount}</b>
          )}
        </button>

      </section>

      {/* =================================================
          SEARCH + FILTER
      ================================================= */}

      <section className="menu-toolbar">

        <div className="menu-search">

          <i className="bi bi-search"></i>

          <input
            type="text"
            placeholder="Search food, dishes or categories..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
            >
              <i className="bi bi-x-lg"></i>
            </button>
          )}

        </div>

        <div className="menu-sort">

          <i className="bi bi-sort-down"></i>

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value)
            }
          >
            <option value="default">
              Sort By
            </option>

            <option value="low">
              Price: Low to High
            </option>

            <option value="high">
              Price: High to Low
            </option>

            <option value="name">
              Name
            </option>
          </select>

        </div>

      </section>

      {/* =================================================
          MENU HEADER
      ================================================= */}

      <section className="menu-heading">

        <div>

          <span>
            OUR MENU
          </span>

          <h2>
            Choose your favorite
          </h2>

        </div>

        <p>
          {loading
            ? "Loading..."
            : `${filteredFoods.length} food items`}
        </p>

      </section>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="menu-error">

          <i className="bi bi-exclamation-triangle"></i>

          <div>
            <strong>
              Menu unavailable
            </strong>

            <p>{error}</p>
          </div>

          <button
            type="button"
            onClick={() => {
              loadFoods();
            }}
          >
            Retry
          </button>

        </div>
      )}

      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (
        <div className="menu-loading">

          <div className="menu-spinner"></div>

          <h3>
            Preparing the menu...
          </h3>

          <p>
            Please wait while we load
            today's dishes.
          </p>

        </div>
      )}

      {/* =================================================
          FOOD GRID
      ================================================= */}

      {!loading &&
        filteredFoods.length > 0 && (

        <section className="food-grid">

          {filteredFoods.map((food) => {

            const isFavorite =
              favorites.includes(food.id);

            const isAdding =
              addingFood === food.id;

            const foodImage =
              getFoodImage(food);

            return (
              <article
                className="food-card"
                key={food.id}
              >

                {/* IMAGE */}

                <div
                  className="food-image-wrap"
                  onClick={() =>
                    handleFoodClick(food)
                  }
                >

                  {foodImage ? (
                    <img
                      src={foodImage}
                      alt={food.name}
                      onError={(e) => {
                        e.currentTarget.style.display =
                          "none";
                      }}
                    />
                  ) : (
                    <div className="food-image-empty">
                      <i className="bi bi-image"></i>

                      <span>
                        No image
                      </span>
                    </div>
                  )}

                  {/* Availability */}

                  {food.available === false ? (
                    <span className="food-status unavailable">
                      Unavailable
                    </span>
                  ) : (
                    <span className="food-status available">
                      Available
                    </span>
                  )}

                  {/* Favorite */}

                  <button
                    type="button"
                    className={
                      isFavorite
                        ? "favorite-btn active"
                        : "favorite-btn"
                    }
                    onClick={(e) => {
                      e.stopPropagation();

                      toggleFavorite(
                        food.id
                      );
                    }}
                  >
                    <i
                      className={
                        isFavorite
                          ? "bi bi-heart-fill"
                          : "bi bi-heart"
                      }
                    ></i>
                  </button>

                </div>

                {/* CONTENT */}

                <div className="food-card-content">

                  <h3
                    onClick={() =>
                      handleFoodClick(food)
                    }
                  >
                    {food.name}
                  </h3>

                  <p>
                    {food.description ||
                      "Freshly prepared with quality ingredients."}
                  </p>

                  <div className="food-card-bottom">

                    <strong>
                      ₹
                      {Number(
                        food.price || 0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                    <button
                      type="button"
                      className="add-cart-btn"
                      disabled={
                        food.available === false ||
                        isAdding
                      }
                      onClick={() =>
                        handleAddToCart(
                          food
                        )
                      }
                    >
                      {isAdding ? (
                        <>
                          <span className="mini-spinner"></span>
                          Adding
                        </>
                      ) : (
                        <>
                          <i className="bi bi-cart-plus"></i>
                          Add
                        </>
                      )}
                    </button>

                  </div>

                </div>

              </article>
            );
          })}

        </section>
      )}

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {!loading &&
        !error &&
        filteredFoods.length === 0 && (

        <div className="menu-empty">

          <div className="empty-icon">
            <i className="bi bi-search"></i>
          </div>

          <h3>
            No food found
          </h3>

          <p>
            We couldn't find any food matching
            your search.
          </p>

          <button
            type="button"
            onClick={() => {
              setSearch("");
            }}
          >
            <i className="bi bi-arrow-counterclockwise"></i>
            View All Food
          </button>

        </div>
      )}

      {/* =================================================
          BOTTOM CART BAR
      ================================================= */}

      {cartCount > 0 && (

        <div className="floating-cart">

          <div className="floating-cart-info">

            <div className="floating-cart-icon">
              <i className="bi bi-cart-check-fill"></i>
            </div>

            <div>
              <strong>
                {cartCount}{" "}
                {cartCount === 1
                  ? "item"
                  : "items"}{" "}
                in cart
              </strong>

              <span>
                Ready to checkout
              </span>
            </div>

          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/cart")
            }
          >
            View Cart
            <i className="bi bi-arrow-right"></i>
          </button>

        </div>
      )}

    </main>
  );
};

export default Menu;