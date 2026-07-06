import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";

function Cart() {

  const { cartItems, removeFromCart, clearCart,} = useContext(CartContext);

  const [paymentMethod, setPaymentMethod] =
  useState("Online");

const totalPrice = cartItems.reduce(
  (total, item) =>
    total +
    item.price * (item.quantity || 1),
  0
);

  const placeOrder = async () => {
    const user = JSON.parse(
  localStorage.getItem("dkUser")
);
console.log({
  products: cartItems,
  totalPrice,
  userEmail: user?.email,
});
  try {

    if (paymentMethod === "COD") {

  const orderResponse = await fetch(
    "https://dk-seed-store-backend.onrender.com/api/orders",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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

  const orderData = await orderResponse.json();

  console.log(orderData);

  await fetch(
    "https://dk-seed-store-backend.onrender.com/api/products/update-stock",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        products: cartItems,
      }),
    }
  );

  alert("Order Placed Successfully (Cash on Delivery) ✅");

  clearCart();

  return;
}

    const razorpayResponse = await fetch(
  "https://dk-seed-store-backend.onrender.com/api/payment/create-order",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: totalPrice,
    }),
  }
);

const razorpayOrder = await razorpayResponse.json();

console.log(razorpayOrder);

const options = {
  key: import.meta.env.VITE_RAZORPAY_KEY_ID,

  amount: razorpayOrder.amount,

  currency: razorpayOrder.currency,

  name: "DK Seed Store",

  description: "Seed Purchase",

  order_id: razorpayOrder.id,

 handler: async function (response) {

  console.log(response);

  const orderResponse = await fetch(
    "https://dk-seed-store-backend.onrender.com/api/orders",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        products: cartItems,
        totalPrice,
        userEmail: user?.email,
         paymentMethod: "Online",
  paymentStatus: "Paid",
      }),
    }
  );

  const orderData = await orderResponse.json();

  if (!orderResponse.ok) {
  alert("Payment succeeded, but saving the order failed.");
  return;
}

  console.log(orderData);

 const stockResponse =await fetch(
  "https://dk-seed-store-backend.onrender.com/api/products/update-stock",
  {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      products: cartItems,
    }),
  }
);

const stockData = await stockResponse.json();

console.log("Stock Response:", stockData);

  alert("Payment Successful! Order Placed Successfully ✅");

  clearCart();
},
};

const paymentObject =
  new window.Razorpay(options);

paymentObject.open();
  } catch (error) {
    console.log(error);
  }
};

  return (
    <div style={{ padding: "50px" }}>
      <h1>Your Cart</h1>

      {cartItems.length === 0 ? (
        <p>Cart is Empty</p>
      ) : (
        <>
          {cartItems.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                marginBottom: "20px",
                padding: "15px",
                border: "1px solid #ddd",
                borderRadius: "10px",
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                width="120"
                style={{
                  borderRadius: "10px",
                }}
              />

              <div>
                <h3>{item.name}</h3>

               <p>Price: ₹{item.price}</p>

<p>
  Quantity: {item.quantity || 1}
</p>

<p>
  Subtotal: ₹
  {item.price * (item.quantity || 1)}
</p>

                <button
                  onClick={() => removeFromCart(index)}
                  style={{
                    background: "red",
                    color: "white",
                    border: "none",
                    padding: "8px 15px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div
            style={{
              marginTop: "30px",
              fontSize: "24px",
              fontWeight: "bold",
              color: "#2e7d32",
            }}
          >
            Total: ₹{totalPrice}
          </div>

          <div
  style={{
    marginTop: "25px",
    marginBottom: "20px",
  }}
>
  <h3>Select Payment Method</h3>

  <label
    style={{
      display: "block",
      margin: "10px 0",
      cursor: "pointer",
    }}
  >
    <input
      type="radio"
      value="Online"
      checked={paymentMethod === "Online"}
      onChange={(e) =>
        setPaymentMethod(e.target.value)
      }
    />

    {" "}Pay Online (Razorpay)
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
      checked={paymentMethod === "COD"}
      onChange={(e) =>
        setPaymentMethod(e.target.value)
      }
    />

    {" "}Cash on Delivery
  </label>
</div>

          <button
  onClick={placeOrder}
  style={{
    marginTop: "20px",
    padding: "12px 25px",
    background: "#2e7d32",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  }}
>
  Place Order
</button>
        </>
      )}
    </div>
  );
}

export default Cart;