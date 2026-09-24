const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
    min: [0, "Price cannot be negative"],
  },

  category: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true,
  },

  rating: {
    type: Number,
    default: 4.5,
  },

 stock: {
  type: Number,
  default: 20,
   min: [0, "Stock cannot be negative"],
},

  discount: {
    type: String,
    default: "10% OFF",
  },
});

module.exports =
  mongoose.model("Product", productSchema);