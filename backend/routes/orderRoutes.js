const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const updateStock = require("../utils/updateStock");
const restoreStock = require("../utils/restoreStock");

const router = express.Router();

// Get Orders
router.get("/", protect, async (req, res) => {
  try {
    let orders;

    if (req.user.role === "admin") {
      // Admin can see all orders
      orders = await Order.find().sort({
        orderDate: -1,
      });
    } else {
      // Customer can see only their own orders
      orders = await Order.find({
        userId: req.user.userId,
      }).sort({
        orderDate: -1,
      });
    }

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Get My Orders
// Always returns only the currently logged-in user's orders
router.get("/my", protect, async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.user.userId,
    }).sort({
      orderDate: -1,
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Dashboard Stats
router.get("/dashboard", protect, adminOnly, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();

    const totalOrders = await Order.countDocuments();

    const pendingOrders = await Order.countDocuments({
      status: "Pending",
    });

    const shippedOrders = await Order.countDocuments({
      status: "Shipped",
    });

    const deliveredOrders = await Order.countDocuments({
      status: "Delivered",
    });

    const orders = await Order.find();

    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalPrice,
      0
    );

    res.json({
      totalProducts,
      totalOrders,
      pendingOrders,
      shippedOrders,
      deliveredOrders,
      totalRevenue,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Get Single Order
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Admin can view any order
    if (req.user.role === "admin") {
      return res.json(order);
    }

    // Customer can only view their own order
    if (
      !order.userId ||
      order.userId.toString() !== req.user.userId.toString()
    ) {
      return res.status(403).json({
        message: "You are not authorized to view this order",
      });
    }

    res.json(order);
  } catch (error) {
    if (error.name === "CastError" && error.path === "_id") {
      return res.status(400).json({
        message: "Invalid order ID",
      });
    }

    console.error("Get order error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

// Create Order
router.post("/", protect, async (req, res) => {
  try {
    const { products, paymentMethod, razorpayOrderId } = req.body;

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        message: "No products provided",
      });
    }

    if (!["Online", "COD"].includes(paymentMethod)) {
      return res.status(400).json({
        message: "Invalid payment method",
      });
    }

    let calculatedTotal = 0;
    const orderProducts = [];

    for (const item of products) {
      const product = await Product.findById(item._id);

      if (!product) {
        return res.status(404).json({
          message: `Product not found: ${item.name}`,
        });
      }

      // Quantity must be a real number, not a numeric string.
      if (
        typeof item.quantity !== "number" ||
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0
      ) {
        return res.status(400).json({
          message: `Invalid quantity for ${product.name}`,
        });
      }

      const quantity = item.quantity;

      if (product.stock < quantity) {
        return res.status(400).json({
          message:
            `Not enough stock for ${product.name}. ` +
            `Available stock: ${product.stock}`,
        });
      }

      orderProducts.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        quantity,
      });

      calculatedTotal += product.price * quantity;
    }

    const orderData = {
      products: orderProducts,
      userEmail: user.email,
      userId: req.user.userId,
      totalPrice: calculatedTotal,
      paymentMethod,
      paymentStatus: "Pending",
      razorpayOrderId:
        paymentMethod === "Online"
          ? razorpayOrderId
          : undefined,
      shippingAddress: {
        street: user.address?.street || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        pincode: user.address?.pincode || "",
      },
    };

    // COD:
    // Create the order and update stock inside one transaction.
    if (paymentMethod === "COD") {
      const session = await mongoose.startSession();

      try {
        session.startTransaction();

        const [order] = await Order.create(
          [orderData],
          { session }
        );

        await updateStock(orderProducts, session);

        await session.commitTransaction();

        return res.status(201).json(order);
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        await session.endSession();
      }
    }

    // Online:
    // Stock is updated only after Razorpay payment verification.
    const order = await Order.create(orderData);

    res.status(201).json(order);
  } catch (error) {
    console.error("Create order error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

// Update Order Status - Admin Only
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Prevent unnecessary status update
    if (order.status === status) {
      return res.status(400).json({
        message: `Order is already ${status}`,
      });
    }

    // -----------------------------------------------------
    // FINAL STATUSES
    // -----------------------------------------------------
    // Once an order is Delivered or Cancelled,
    // it cannot be moved to another status.
    if (
      order.status === "Delivered" ||
      order.status === "Cancelled"
    ) {
      return res.status(400).json({
        message: `Order is already ${order.status} and cannot be changed`,
      });
    }

    // -----------------------------------------------------
    // CANCEL ORDER
    // -----------------------------------------------------
    // Restore stock only when an active order is cancelled.
    // Because Cancelled is a final status, stock cannot
    // accidentally be restored multiple times.
    if (status === "Cancelled") {
      await restoreStock(order.products);
    }

    order.status = status;

    await order.save();

    res.json(order);
  } catch (error) {
    if (error.name === "CastError" && error.path === "_id") {
      return res.status(400).json({
        message: "Invalid order ID",
      });
    }

    console.error("Update order status error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;