const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        name: String,
        price: Number,
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],

    userEmail: {
      type: String,
      required: true,
    },

    userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
},

shippingAddress: {
  street: {
    type: String,
    default: "",
  },

  city: {
    type: String,
    default: "",
  },

  state: {
    type: String,
    default: "",
  },

  pincode: {
    type: String,
    default: "",
  },
},

    totalPrice: Number,

    // ✅ NEW
    paymentMethod: {
      type: String,
      enum: ["Online", "COD"],
      default: "Online",
    },

    // ✅ NEW
    paymentStatus: {
      type: String,
      enum: ["Paid", "Pending"],
      default: "Pending",
    },

    razorpayOrderId: {
  type: String,
},

razorpayPaymentId: {
  type: String,
},

razorpaySignature: {
  type: String,
},

  status: {
  type: String,
  enum: [
    "Pending",
    "Confirmed",
    "Shipped",
    "Delivered",
    "Cancelled",
  ],
  default: "Pending",
},

    orderDate: {
      type: Date,
      default: Date.now,
    },
  }
);

module.exports = mongoose.model(
  "Order",
  orderSchema
);