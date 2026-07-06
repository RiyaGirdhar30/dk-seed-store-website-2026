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

    status: {
      type: String,
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