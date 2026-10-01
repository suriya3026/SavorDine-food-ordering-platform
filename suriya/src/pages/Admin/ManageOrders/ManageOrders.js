import React, { useEffect, useState } from "react";
import "./ManageOrders.css";

import {
  getAllOrders,
  getOrderItems,
  updateOrderStatus,
  updatePaymentStatus,
  deleteOrder,
} from "../../../Services/orderService";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState({});
  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD ORDERS
  // ==========================================

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);

      const data = await getAllOrders();

      console.log("Orders from backend:", data);

      const orderList = Array.isArray(data) ? data : [];

      setOrders(orderList);

      // ==========================================
      // LOAD FOOD ITEMS FOR EACH ORDER
      // ==========================================

      const itemsData = {};

      await Promise.all(
        orderList.map(async (order) => {
          try {
            const items = await getOrderItems(order.id);

            itemsData[order.id] = Array.isArray(items)
              ? items
              : [];

          } catch (error) {
            console.error(
              `Failed to load items for order ${order.id}:`,
              error
            );

            itemsData[order.id] = [];
          }
        })
      );

      setOrderItems(itemsData);

    } catch (error) {
      console.error(
        "Load Orders Error:",
        error
      );

      alert("Unable to load orders.");

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // ORDER STATUS
  // ==========================================

  const handleOrderStatus = async (
    orderId,
    status
  ) => {
    try {
      await updateOrderStatus(
        orderId,
        status
      );

      alert(
        "Order status updated successfully!"
      );

      await loadOrders();

    } catch (error) {
      console.error(
        "Order Status Error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.message ||
        "Unable to update order status.";

      alert(message);
    }
  };

  // ==========================================
  // PAYMENT STATUS
  // ==========================================

  const handlePaymentStatus = async (
    orderId,
    paymentStatus
  ) => {
    try {
      await updatePaymentStatus(
        orderId,
        paymentStatus
      );

      alert(
        "Payment status updated successfully!"
      );

      await loadOrders();

    } catch (error) {
      console.error(
        "Payment Status Error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.message ||
        "Unable to update payment status.";

      alert(message);
    }
  };

  // ==========================================
  // DELETE ORDER
  // ==========================================

  const handleDelete = async (orderId) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this order?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteOrder(orderId);

      alert(
        "Order deleted successfully!"
      );

      await loadOrders();

    } catch (error) {
      console.error(
        "Delete Order Error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.message ||
        "Unable to delete order.";

      alert(message);
    }
  };

  // ==========================================
  // DATE FORMAT
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    try {
      return new Date(date).toLocaleString(
        "en-IN",
        {
          dateStyle: "medium",
          timeStyle: "short",
        }
      );
    } catch {
      return date;
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="manage-orders-page">

        <div className="manage-orders-loading">

          <h3>
            Loading Orders...
          </h3>

          <p>
            Please wait while orders
            are loaded.
          </p>

        </div>

      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="manage-orders-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="manage-orders-header">

        <div>

          <h1>
            Manage Orders
          </h1>

          <p>
            View and manage customer orders
          </p>

        </div>

        <div className="orders-count">

          {orders.length} Orders

        </div>

      </div>


      {/* ======================================
          ORDERS
      ====================================== */}

      {orders.length === 0 ? (

        <div className="no-orders">

          <h3>
            No Orders Found
          </h3>

          <p>
            Customer orders will appear
            here after checkout.
          </p>

        </div>

      ) : (

        <div className="orders-table-container">

          <table className="orders-table">

            <thead>

              <tr>

                <th>
                  Order ID
                </th>

                <th>
                  Customer
                </th>

                {/* NEW */}
                <th>
                  Food Items
                </th>

                <th>
                  Total
                </th>

                <th>
                  Address
                </th>

                <th>
                  Order Date
                </th>

                <th>
                  Order Status
                </th>

                <th>
                  Payment
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              {orders.map((order) => (

                <tr key={order.id}>

                  {/* ORDER ID */}

                  <td>
                    #{order.id}
                  </td>


                  {/* CUSTOMER */}

                  <td>

                    <div className="customer-info">

                      <strong>
                        {order.user?.name ||
                          "Unknown User"}
                      </strong>

                      <span>
                        {order.user?.email ||
                          "No email"}
                      </span>

                    </div>

                  </td>


                  {/* ==================================
                      FOOD ITEMS
                  ================================== */}

                  <td>

                    <div
                      style={{
                        minWidth: "180px",
                      }}
                    >

                      {orderItems[order.id] &&
                      orderItems[order.id].length > 0 ? (

                        orderItems[order.id].map(
                          (item, index) => (

                            <div
                              key={
                                item.id || index
                              }
                              style={{
                                marginBottom:
                                  "8px",
                              }}
                            >

                              <strong>
                                {item.food?.name ||
                                  "Unknown Food"}
                              </strong>

                              <span
                                style={{
                                  display:
                                    "block",
                                  fontSize:
                                    "13px",
                                  marginTop:
                                    "2px",
                                }}
                              >
                                Qty:{" "}
                                {item.quantity || 0}
                                {" × "}
                                ₹
                                {Number(
                                  item.price || 0
                                ).toFixed(2)}
                              </span>

                            </div>

                          )

                        )

                      ) : (

                        <span>
                          No food items
                        </span>

                      )}

                    </div>

                  </td>


                  {/* TOTAL */}

                  <td>

                    <strong>
                      ₹
                      {Number(
                        order.totalAmount || 0
                      ).toFixed(2)}
                    </strong>

                  </td>


                  {/* ADDRESS */}

                  <td>

                    {order.deliveryAddress ||
                      "No address"}

                  </td>


                  {/* DATE */}

                  <td>

                    {formatDate(
                      order.orderDate
                    )}

                  </td>


                  {/* ORDER STATUS */}

                  <td>

                    <select
                      value={
                        order.orderStatus ||
                        "PLACED"
                      }
                      onChange={(e) =>
                        handleOrderStatus(
                          order.id,
                          e.target.value
                        )
                      }
                    >

                      <option value="PLACED">
                        PLACED
                      </option>

                      <option value="CONFIRMED">
                        CONFIRMED
                      </option>

                      <option value="PREPARING">
                        PREPARING
                      </option>

                      <option value="OUT_FOR_DELIVERY">
                        OUT FOR DELIVERY
                      </option>

                      <option value="DELIVERED">
                        DELIVERED
                      </option>

                      <option value="CANCELLED">
                        CANCELLED
                      </option>

                    </select>

                  </td>


                  {/* PAYMENT */}

                  <td>

                    <select
                      value={
                        order.paymentStatus ||
                        "PENDING"
                      }
                      onChange={(e) =>
                        handlePaymentStatus(
                          order.id,
                          e.target.value
                        )
                      }
                    >

                      <option value="PENDING">
                        PENDING
                      </option>

                      <option value="PAID">
                        PAID
                      </option>

                      <option value="FAILED">
                        FAILED
                      </option>

                      <option value="REFUNDED">
                        REFUNDED
                      </option>

                    </select>

                  </td>


                  {/* ACTION */}

                  <td>

                    <button
                      type="button"
                      className="delete-order-btn"
                      onClick={() =>
                        handleDelete(
                          order.id
                        )
                      }
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
};

export default ManageOrders;
