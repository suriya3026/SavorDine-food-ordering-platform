import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "./App.css";

// ========================================
// COMPONENTS
// ========================================

import Navbar from "./components/Navbar/Navbar";
import Header from "./components/Header/Header";

// ========================================
// USER PAGES
// ========================================

import Home from "./pages/Home/Home";
import Menu from "./pages/Menu/Menu";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";
import Orders from "./pages/Orders/Orders";
import OrderTracking from "./pages/OrderTracking/OrderTracking";
import OrderSuccess from "./pages/OrderSuccess/OrderSuccess";
import FoodDetails from "./pages/FoodDetails/FoodDetails";
import Offers from "./pages/Offers/Offers";
import Profile from "./pages/Profile/Profile";
import Settings from "./pages/Settings/Settings";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

// ========================================
// ADMIN PAGES
// ========================================

import AdminLogin from "./pages/Admin/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/Dashboard/Dashboard";
import ManageFood from "./pages/Admin/ManageFood/ManageFood";
import ManageOrders from "./pages/Admin/ManageOrders/ManageOrders";
import ManageUsers from "./pages/Admin/ManageUsers/ManageUsers";
import ManageCategories from "./pages/Admin/Categories/Categories";


function App() {
  return (
    <BrowserRouter>

      <div className="app-layout">

        {/* ==================================
            NAVBAR
        ================================== */}

        <Navbar />


        {/* ==================================
            HEADER
        ================================== */}

        <Header />


        {/* ==================================
            MAIN CONTENT
        ================================== */}

        <main className="main-content">

          <Routes>

            {/* ==================================
                USER ROUTES
            ================================== */}

            <Route
              path="/"
              element={<Home />}
            />

            <Route
              path="/home"
              element={<Home />}
            />


            {/* MENU */}

            <Route
              path="/menu"
              element={<Menu />}
            />


            {/* FOOD DETAILS */}

            <Route
              path="/food/:id"
              element={<FoodDetails />}
            />

            <Route
              path="/fooddetails"
              element={<FoodDetails />}
            />


            {/* CART */}

            <Route
              path="/cart"
              element={<Cart />}
            />


            {/* CHECKOUT */}

            <Route
              path="/checkout"
              element={<Checkout />}
            />


            {/* ORDERS */}

            <Route
              path="/orders"
              element={<Orders />}
            />


            {/* ORDER TRACKING */}

            <Route
              path="/ordertracking"
              element={<OrderTracking />}
            />


            {/* ORDER SUCCESS */}

            <Route
              path="/orderssuccess"
              element={<OrderSuccess />}
            />


            {/* OFFERS */}

            <Route
              path="/offers"
              element={<Offers />}
            />


            {/* PROFILE */}

            <Route
              path="/profile"
              element={<Profile />}
            />


            {/* SETTINGS */}

            <Route
              path="/settings"
              element={<Settings />}
            />


            {/* ==================================
                AUTHENTICATION
            ================================== */}

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/register"
              element={<Register />}
            />


            {/* ==================================
                ADMIN ROUTES
            ================================== */}


            <Route
              path="/adminlogin"
              element={<AdminLogin/>}
            />

            <Route
              path="/admin/dashboard"
              element={<AdminDashboard />}
            />

            <Route
              path="/admin/food"
              element={<ManageFood />}
            />

            <Route
              path="/admin/orders"
              element={<ManageOrders />}
            />

            <Route
              path="/admin/users"
              element={<ManageUsers />}
            />

            <Route
              path="/admin/categories"
              element={<ManageCategories />}
            />


            {/* ==================================
                OLD ADMIN ROUTES
            ================================== */}

            <Route
              path="/AdminDashboard"
              element={
                <Navigate
                  to="/admin/dashboard"
                  replace
                />
              }
            />

            <Route
              path="/ManageFood"
              element={
                <Navigate
                  to="/admin/food"
                  replace
                />
              }
            />

            <Route
              path="/ManageOrders"
              element={
                <Navigate
                  to="/admin/orders"
                  replace
                />
              }
            />

            <Route
              path="/ManageUsers"
              element={
                <Navigate
                  to="/admin/users"
                  replace
                />
              }
            />

            <Route
              path="/Categories"
              element={
                <Navigate
                  to="/admin/categories"
                  replace
                />
              }
            />


            {/* ==================================
                INVALID URL
            ================================== */}

            <Route
              path="*"
              element={
                <Navigate
                  to="/"
                  replace
                />
              }
            />

          </Routes>

        </main>

      </div>

    </BrowserRouter>
  );
}

export default App;