const express = require("express");
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
  order.userId.toString() !==
    req.user.userId.toString()
) {
  return res.status(403).json({
    message:
      "You are not authorized to view this order",
  });
}

    res.json(order);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Create Order
router.post("/", protect, async (req, res) => {
  try {
    const { products, paymentMethod, razorpayOrderId } = req.body;

    // =====================================================
    // FIND LOGGED-IN USER
    // =====================================================

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // =====================================================
    // VALIDATE PRODUCTS
    // =====================================================

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        message: "No products provided",
      });
    }

    // =====================================================
    // VALIDATE PAYMENT METHOD
    // =====================================================

    if (!["Online", "COD"].includes(paymentMethod)) {
      return res.status(400).json({
        message: "Invalid payment method",
      });
    }

    // =====================================================
    // CALCULATE TOTAL FROM DATABASE
    // =====================================================

    let calculatedTotal = 0;

    const orderProducts = [];

    for (const item of products) {
      const product = await Product.findById(item._id);

      if (!product) {
        return res.status(404).json({
          message: `Product not found: ${item.name}`,
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

      // Check stock
      if (product.stock < quantity) {
        return res.status(400).json({
          message:
            `Not enough stock for ${product.name}. ` +
            `Available stock: ${product.stock}`,
        });
      }

      // Use REAL database price
   // Use REAL database product details
orderProducts.push({
  _id: product._id,
  name: product.name,
  price: product.price,
  quantity: quantity,
});

// Use REAL database price
calculatedTotal += product.price * quantity;
    }

    // =====================================================
    // CREATE ORDER
    // =====================================================

   const order = await Order.create({
  products: orderProducts,

      // NEVER trust frontend email
      userEmail: user.email,

      // NEVER trust frontend userId
      userId: req.user.userId,

      // NEVER trust frontend totalPrice
      totalPrice: calculatedTotal,

      paymentMethod,

      // New orders always start as Pending
      paymentStatus: "Pending",

      // Only Online orders should have Razorpay ID
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
    });

    // =====================================================
    // COD → UPDATE STOCK IMMEDIATELY
    // ONLINE → STOCK UPDATED AFTER PAYMENT VERIFICATION
    // =====================================================

   if (paymentMethod === "COD") {
  await updateStock(orderProducts);
}

    res.status(201).json(order);

  } catch (error) {
    console.error(
      "Create order error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
});

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

    // Restore stock only when an order
    // is being cancelled for the first time
    if (status === "Cancelled") {
      await restoreStock(order.products);
    }

    order.status = status;

    await order.save();

    res.json(order);

  } catch (error) {
    console.error("Update order status error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

// Dashboard Stats
router.get("/dashboard", protect, adminOnly, async (req, res) => {
  try {

    const totalProducts =
      await Product.countDocuments();

    const totalOrders =
      await Order.countDocuments();

    const pendingOrders =
      await Order.countDocuments({
        status: "Pending",
      });

      const shippedOrders =
  await Order.countDocuments({
    status: "Shipped",
  });

const deliveredOrders =
  await Order.countDocuments({
    status: "Delivered",
  });

    const orders =
      await Order.find();

    const totalRevenue =
      orders.reduce(
        (sum, order) =>
          sum + order.totalPrice,
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

module.exports = router;