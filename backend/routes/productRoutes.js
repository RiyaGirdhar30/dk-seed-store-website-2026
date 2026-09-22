const express = require("express");
const Product = require("../models/Product");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(
      req.params.id
    );

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.put("/update-stock", protect, async (req, res) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        message: "No products provided",
      });
    }

    for (const item of products) {
      const quantity = item.quantity;

      // Validate product ID
      if (!item._id) {
        return res.status(400).json({
          message: "Product ID is required",
        });
      }

      // Validate quantity
      if (
        !Number.isInteger(quantity) ||
        quantity <= 0
      ) {
        return res.status(400).json({
          message: "Invalid quantity",
        });
      }

      // Atomically decrease stock only if enough stock exists
      const updatedProduct =
        await Product.findOneAndUpdate(
          {
            _id: item._id,
            stock: { $gte: quantity },
          },
          {
            $inc: {
              stock: -quantity,
            },
          },
          {
            new: true,
          }
        );

      if (!updatedProduct) {
        const product =
          await Product.findById(item._id);

        if (!product) {
          return res.status(404).json({
            message: "Product not found",
          });
        }

        return res.status(400).json({
          message: `Not enough stock for ${product.name}. Available stock: ${product.stock}`,
        });
      }
    }

    res.json({
      message: "Stock Updated Successfully",
    });

  } catch (error) {
    console.error("Update stock error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const updatedProduct =
      await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          returnDocument:"after",
        }
      );

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await Product.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message:
        "Product Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;