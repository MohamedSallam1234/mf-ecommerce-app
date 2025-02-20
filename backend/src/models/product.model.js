const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  rate: {
    type: Number,
    min: [0, "Rating cannot be negative"],
    max: [5, "Rating cannot be more than 5"],
    default: 0,
  },
  count: {
    type: Number,
    min: [0, "Count cannot be negative"],
    default: 0,
  },
});

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Product image URL is required"],
    },
    rating: {
      type: ratingSchema,
      default: { rate: 0, count: 0 },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
