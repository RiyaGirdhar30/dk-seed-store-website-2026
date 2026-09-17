import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

function Orders() {
  const [orders, setOrders] = useState([]);

  const { token } = useAuth();

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
          data.message || "Unable to fetch orders"
        );
        return;
      }

      setOrders(data);
    } catch (error) {
      console.error(
        "Admin orders error:",
        error
      );
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const updateStatus = async (
    orderId,
    newStatus
  ) => {
    try {
      const response = await fetch(
        `${API_URL}/api/orders/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to update order status"
        );
        return;
      }

      await fetchOrders();

    } catch (error) {
      console.error(
        "Update status error:",
        error
      );
    }
  };

  return (
    <div
      style={{
        padding: "30px",
      }}
    >
      <h1>All Orders</h1>

      {orders.length === 0 ? (
        <p>No Orders Found</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              marginBottom: "20px",
              borderRadius: "10px",
            }}
          >
            <h3>
              Order ID:
              {order._id.slice(-6)}
            </h3>

            <p>
              Customer:
              {order.userEmail}
            </p>

            <p>
              Total:
              ₹{order.totalPrice}
            </p>

            <p>
              Status:

              <span
                style={{
                  marginLeft: "10px",
                  padding: "5px 12px",
                  borderRadius: "20px",
                  color: "white",
                  backgroundColor:
                    order.status === "Pending"
                      ? "orange"
                      : order.status === "Confirmed"
                      ? "blue"
                      : order.status === "Shipped"
                      ? "purple"
                      : order.status === "Delivered"
                      ? "green"
                      : "red",
                }}
              >
                {order.status}
              </span>
            </p>

            <p>
              Date:
              {new Date(
                order.orderDate
              ).toLocaleDateString()}
            </p>

            <h4>Products:</h4>

            {order.products.map(
              (product, index) => (
                <p key={index}>
                  • {product.name}
                  {" × "}
                  {product.quantity || 1}
                  {" - ₹"}
                  {product.price *
                    (product.quantity || 1)}
                </p>
              )
            )}

            <select
              value={order.status}
              onChange={(e) =>
                updateStatus(
                  order._id,
                  e.target.value
                )
              }
              style={{
                marginTop: "10px",
                padding: "8px",
              }}
            >
              <option value="Pending">
                Pending
              </option>

              <option value="Confirmed">
                Confirmed
              </option>

              <option value="Shipped">
                Shipped
              </option>

              <option value="Delivered">
                Delivered
              </option>

              <option value="Cancelled">
                Cancelled
              </option>
            </select>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;