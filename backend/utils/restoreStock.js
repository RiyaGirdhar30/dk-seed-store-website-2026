const Product = require("../models/Product");

const restoreStock = async (products) => {
  for (const item of products) {
    const quantity = item.quantity;

    if (
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      throw new Error("Invalid quantity");
    }

    const updatedProduct =
      await Product.findByIdAndUpdate(
        item._id,
        {
          $inc: {
            stock: quantity,
          },
        },
        {
          returnDocument: "after",
        }
      );

    if (!updatedProduct) {
      throw new Error(
        `Product not found: ${item.name}`
      );
    }
  }
};

module.exports = restoreStock;