import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/OrderHistory.css";

const API_URL = import.meta.env.VITE_API_URL;

function OrderHistory() {
  const [orders, setOrders] = useState([]);

  const { token } = useAuth();

useEffect(() => {
  const fetchOrders = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(
          data.message ||
            "Unable to fetch orders"
        );

        return;
      }

      setOrders(data);
    } catch (error) {
      console.error(
        "Order history error:",
        error
      );
    }
  };

  if (token) {
    fetchOrders();
  }
}, [token]);

  return (
   <div className="order-history">
      <h1>My Orders</h1>

      {orders.length === 0 ? (
        <p>No Orders Found</p>
      ) : (
        orders.map((order) => (
        <div
  key={order._id}
  className="order-card"
>
  {/* ORDER HEADER */}
  <div className= "order-header">
   
   <h3>
      Order #{order._id.slice(-6)}
    </h3>

   <span
  className="order-status"
  style={{
    background:
      order.status === "Pending"
        ? "#ff9800"
        : order.status === "Confirmed"
        ? "#2196f3"
        : order.status === "Shipped"
        ? "#673ab7"
        : order.status === "Delivered"
        ? "#4caf50"
        : "#f44336",
  }}
>

      {order.status}
    </span>
  </div>

  {/* DATE */}
  <p>
    📅 <strong>Date:</strong>{" "}
    {new Date(
      order.orderDate
    ).toLocaleDateString()}
  </p>

  {/* PRODUCTS */}
  <h4>📦 Products</h4>

  {order.products.map(
  (product, index) => (
    <div
      key={index}
      className="order-product"
    >
      <span>
        {product.name} ×{" "}
        {product.quantity || 1}
      </span>

      <strong>
        ₹
        {product.price *
          (product.quantity || 1)}
      </strong>
    </div>
  )
)}

  {/* TOTAL */}
  <div className="order-total">
    💰 Total: ₹{order.totalPrice}
  </div>

  {/* PAYMENT */}
  <div className="order-section">
    <h4 style={{ marginTop: 0 }}>
      💳 Payment
    </h4>

    <p>
      <strong>Method:</strong>{" "}
      {order.paymentMethod}
    </p>

    <p>
      <strong>Status:</strong>{" "}
      <span
        style={{
          fontWeight: "bold",
          color:
            order.paymentStatus === "Paid"
              ? "#2e7d32"
              : "#ff9800",
        }}
      >
        {order.paymentStatus}
      </span>
    </p>
  </div>

  {/* SHIPPING ADDRESS */}
  <div className="order-section">
    <h4 style={{ marginTop: 0 }}>
      📍 Shipping Address
    </h4>

    <p>
      {order.shippingAddress?.street ||
        "Address not provided"}
    </p>

    <p>
      {order.shippingAddress?.city &&
        `${order.shippingAddress.city}, `}
      {order.shippingAddress?.state}
    </p>

    <p>
      <strong>
        Pincode:
      </strong>{" "}
      {order.shippingAddress?.pincode ||
        "N/A"}
    </p>
  </div>
</div>
        ))
      )}
    </div>
  );
}

export default OrderHistory;