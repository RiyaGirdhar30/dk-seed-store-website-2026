const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const razorpay = require("../config/razorpay");
const protect = require("../middleware/authMiddleware");
const Order = require("../models/Order");
const Product = require("../models/Product");
const updateStock = require("../utils/updateStock");

router.post("/create-order", protect, async (req, res) => {
  try {
    const { products } = req.body;

    // Make sure products were provided
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        message: "No products provided",
      });
    }

    let calculatedTotal = 0;

    // Calculate price using MongoDB product data
    for (const item of products) {
      const product = await Product.findById(item._id);

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      const quantity = Number(item.quantity);

      if (
        !Number.isInteger(quantity) ||
        quantity <= 0
      ) {
        return res.status(400).json({
          message: `Invalid quantity for ${product.name}`,
        });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          message:
            `Not enough stock for ${product.name}. ` +
            `Available stock: ${product.stock}`,
        });
      }

      calculatedTotal +=
        product.price * quantity;
    }

    const options = {
      amount: Math.round(calculatedTotal * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder =
      await razorpay.orders.create(options);

    res.json({
      ...razorpayOrder,
      calculatedTotal,
    });

  } catch (error) {
    console.error(
      "Create Razorpay order error:",
      error
    );

    res.status(500).json({
      message: "Unable to create Razorpay order",
    });
  }
});

router.post("/verify", protect, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        message: "Missing payment verification details",
      });
    }

    const generatedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_KEY_SECRET
        )
        .update(
          `${razorpay_order_id}|${razorpay_payment_id}`
        )
        .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        message: "Payment verification failed",
      });
    }

    const order = await Order.findOne({
      razorpayOrderId: razorpay_order_id,
      userId: req.user.userId,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (order.paymentStatus === "Paid") {
  return res.status(400).json({
    message: "Payment has already been verified",
    order,
  });
}

   order.razorpayPaymentId =
  razorpay_payment_id;

order.razorpaySignature =
  razorpay_signature;

order.paymentStatus = "Paid";

await updateStock(order.products);

await order.save();

    res.json({
      message: "Payment verified successfully",
      order,
    });

  } catch (error) {
    console.error("Payment verification error:", error);

    res.status(500).json({
      message: "Unable to verify payment",
    });
  }
});

module.exports = router;