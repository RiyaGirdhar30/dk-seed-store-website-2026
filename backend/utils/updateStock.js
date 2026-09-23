// const Product = require("../models/Product");

// const updateStock = async (products) => {
//   for (const item of products) {
//     const quantity = item.quantity;

//     if (
//       !Number.isInteger(quantity) ||
//       quantity <= 0
//     ) {
//       throw new Error("Invalid quantity");
//     }

//     const updatedProduct =
//       await Product.findOneAndUpdate(
//         {
//           _id: item._id,
//           stock: { $gte: quantity },
//         },
//         {
//           $inc: {
//             stock: -quantity,
//           },
//         },
//         {
//           returnDocument: "after",
//         }
//       );

//     if (!updatedProduct) {
//       const product =
//         await Product.findById(item._id);

//       if (!product) {
//         throw new Error(
//           `Product not found: ${item.name}`
//         );
//       }

//       throw new Error(
//         `Not enough stock for ${product.name}. Available stock: ${product.stock}`
//       );
//     }
//   }
// };

// module.exports = updateStock;


const Product = require("../models/Product");

const updateStock = async (products, session = null) => {
  for (const item of products) {
    const quantity = item.quantity;

    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error("Invalid quantity");
    }

    const updatedProduct = await Product.findOneAndUpdate(
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
        returnDocument: "after",
        session,
      }
    );

    if (!updatedProduct) {
      const product = await Product.findById(item._id).session(session);

      if (!product) {
        throw new Error(`Product not found: ${item.name}`);
      }

      throw new Error(
        `Not enough stock for ${product.name}. Available stock: ${product.stock}`
      );
    }
  }
};

module.exports = updateStock;