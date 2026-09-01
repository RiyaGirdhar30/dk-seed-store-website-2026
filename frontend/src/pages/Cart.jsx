import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "../styles/Cart.css";

const API_URL = import.meta.env.VITE_API_URL;

function Cart() {
  const {
    cartItems,
    removeFromCart,
    clearCart,
  } = useContext(CartContext);

  const { token, isLoggedIn, user} = useAuth();

  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] =
    useState("Online");

    const [processing, setProcessing] = useState(false);

  const totalPrice = cartItems.reduce(
    (total, item) =>
      total +
      item.price * (item.quantity || 1),
    0
  );

  const placeOrder = async () => {
      if (processing) {
    return;
  }
    if (!isLoggedIn) {
  alert("Please login before placing an order.");
  navigate("/login");
  return;
}

const address = user?.address;

if (
  !address?.street?.trim() ||
  !address?.city?.trim() ||
  !address?.state?.trim() ||
  !address?.pincode?.trim()
) {
  alert(
    "Please complete your shipping address before placing the order."
  );

  navigate("/profile");
  return;
}

    console.log({
      products: cartItems,
      totalPrice,
      userEmail: user?.email,
    });

    setProcessing(true);

    try {
      console.log(
        "Selected Payment Method:",
        paymentMethod
      );

      // =====================================================
      // COD PAYMENT
      // =====================================================

      if (paymentMethod === "COD") {
        const orderResponse = await fetch(
          `${API_URL}/api/orders`,
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },

            body: JSON.stringify({
              products: cartItems,
              totalPrice,
              userEmail: user?.email,
              paymentMethod: "COD",
              paymentStatus: "Pending",
            }),
          }
        );

        const orderData =
          await orderResponse.json();

        console.log(
          "COD Order Response:",
          orderData
        );

        if (!orderResponse.ok) {
          alert(
            orderData.message ||
              "Unable to place order"
          );

          return;
        }

        alert(
          "Order Placed Successfully (Cash on Delivery) ✅"
        );

        clearCart();

        return;
      }

      // =====================================================
      // ONLINE PAYMENT - CREATE RAZORPAY ORDER
      // =====================================================

      const razorpayResponse = await fetch(
        `${API_URL}/api/payment/create-order`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

        body: JSON.stringify({
  products: cartItems,
}),
        }
      );

      const razorpayOrder =
        await razorpayResponse.json();

      console.log(
        "Razorpay Order:",
        razorpayOrder
      );

      if (!razorpayResponse.ok) {
        alert(
          razorpayOrder.message ||
            "Unable to create payment order"
        );

        return;
      }

      // =====================================================
      // CREATE ONE PENDING MONGODB ORDER
      // =====================================================

      const orderResponse = await fetch(
        `${API_URL}/api/orders`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            products: cartItems,
            totalPrice,
            userEmail: user?.email,

            paymentMethod: "Online",

            paymentStatus: "Pending",

            razorpayOrderId:
              razorpayOrder.id,
          }),
        }
      );

      const pendingOrder =
        await orderResponse.json();

      console.log(
        "Pending MongoDB Order:",
        pendingOrder
      );

      if (!orderResponse.ok) {
        alert(
          pendingOrder.message ||
            "Unable to create order"
        );

        return;
      }

      // =====================================================
      // RAZORPAY CHECKOUT
      // =====================================================

      const options = {
        key: import.meta.env
          .VITE_RAZORPAY_KEY_ID,

        amount: razorpayOrder.amount,

        currency: razorpayOrder.currency,

        name: "DK Seed Store",

        description: "Seed Purchase",

        order_id: razorpayOrder.id,

        // =================================================
        // PAYMENT SUCCESS HANDLER
        // =================================================

        handler: async function (response) {
          try {
            console.log(
              "Razorpay Response:",
              response
            );

            // =============================================
            // VERIFY PAYMENT ON BACKEND
            // =============================================

            const verifyResponse =
              await fetch(
                `${API_URL}/api/payment/verify`,
                {
                  method: "POST",

                  headers: {
                    "Content-Type":
                      "application/json",

                    Authorization: `Bearer ${token}`,
                  },

                  body: JSON.stringify({
                    razorpay_order_id:
                      response.razorpay_order_id,

                    razorpay_payment_id:
                      response.razorpay_payment_id,

                    razorpay_signature:
                      response.razorpay_signature,
                  }),
                }
              );

            const verifyData =
              await verifyResponse.json();

            console.log(
              "Verification Response:",
              verifyData
            );

            // =============================================
            // PAYMENT VERIFICATION FAILED
            // =============================================

            if (!verifyResponse.ok) {
              alert(
                verifyData.message ||
                  "Payment verification failed."
              );

              return;
            }

            // =============================================
            // PAYMENT VERIFIED
            // NOW UPDATE STOCK
            // =============================================

            // =============================================
            // EVERYTHING SUCCESSFUL
            // =============================================

            alert(
              "Payment Successful! Order Placed Successfully ✅"
            );

            clearCart();

          } catch (error) {
            console.error(
              "Payment processing error:",
              error
            );

            alert(
              "Payment was completed, but something went wrong while processing your order."
            );
          }
        },
      };

      // =====================================================
      // OPEN RAZORPAY
      // =====================================================

      const paymentObject =
        new window.Razorpay(options);

      paymentObject.open();

    } catch (error) {
      console.error(
        "Order/Payment error:",
        error
      );

      alert(
        "Something went wrong. Please try again."
      );
    }
    finally {
  setProcessing(false);
}
  };

  return (
   <div className="cart-page">
      <h1>Your Cart</h1>

      {cartItems.length === 0 ? (
        <p>Cart is Empty</p>
      ) : (
        <>
          {cartItems.map((item, index) => (
           <div
  key={index}
  className="cart-item"
>
             <img
  src={item.image}
  alt={item.name}
/>

              <div className="cart-item-details">
                <h3>{item.name}</h3>

                <p>
                  Price: ₹{item.price}
                </p>

                <p>
                  Quantity:{" "}
                  {item.quantity || 1}
                </p>

                <p>
                  Subtotal: ₹
                  {item.price *
                    (item.quantity || 1)}
                </p>

                <button
                  onClick={() =>
                    removeFromCart(index)
                  }
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

       <div className="cart-total">
  Total: ₹{totalPrice}
</div>

<div className="shipping-address">
  <h3>📍 Shipping Address</h3>

  {user?.address?.street ||
  user?.address?.city ||
  user?.address?.state ||
  user?.address?.pincode ? (
    <>
      <p>
        {user.address.street}
      </p>

      <p>
        {user.address.city}
        {user.address.city &&
          user.address.state
          ? ", "
          : ""}
        {user.address.state}
      </p>

      <p>
        <strong>Pincode:</strong>{" "}
        {user.address.pincode}
      </p>
    </>
  ) : (
    <p>
      No shipping address saved.
      Please update your address in My Profile.
    </p>
  )}
</div>

         <div className="payment-method">
            <h3>
              Select Payment Method
            </h3>

           <label className="payment-option">
              <input
                type="radio"
                value="Online"
                checked={
                  paymentMethod === "Online"
                }
                onChange={(e) =>
                  setPaymentMethod(
                    e.target.value
                  )
                }
              />

              {" "}
              Pay Online (Razorpay)
            </label>

            <label
              style={{
                display: "block",
                margin: "10px 0",
                cursor: "pointer",
              }}
            >
              <input
                type="radio"
                value="COD"
                checked={
                  paymentMethod === "COD"
                }
                onChange={(e) =>
                  setPaymentMethod(
                    e.target.value
                  )
                }
              />

              {" "}
              Cash on Delivery
            </label>
          </div>

          <button
            onClick={placeOrder}
            disabled={processing}
           className="place-order-btn"
          >
            {processing ? "Processing..." : "Place Order"}
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;