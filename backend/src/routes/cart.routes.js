const express = require("express");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

const router = express.Router();

// @route   GET /api/cart/:userId
// @desc    Get user's cart
// @access  Private
router.get("/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate(
      "products.productId",
      "title price image"
    );

    if (!cart) {
      return res.json({
        userId: req.params.userId,
        products: [],
        date: new Date(),
      });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   POST /api/cart
// @desc    Create or update cart
// @access  Private
router.post("/", async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Find existing cart or create new one
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({
        userId,
        products: [{ productId, quantity }],
        date: new Date(),
      });
    } else {
      // Check if product exists in cart
      const productIndex = cart.products.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (productIndex > -1) {
        // Update quantity if product exists
        cart.products[productIndex].quantity = quantity;
      } else {
        // Add new product if it doesn't exist
        cart.products.push({ productId, quantity });
      }

      await cart.save();
    }

    // Populate product details
    await cart.populate("products.productId", "title price image");

    res.json(cart);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   DELETE /api/cart/:userId/products/:productId
// @desc    Remove product from cart
// @access  Private
router.delete("/:userId/products/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.products = cart.products.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();
    await cart.populate("products.productId", "title price image");

    res.json(cart);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   PUT /api/cart/:userId/products/:productId
// @desc    Update product quantity in cart
// @access  Private
router.put("/:userId/products/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const productIndex = cart.products.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    cart.products[productIndex].quantity = quantity;
    await cart.save();
    await cart.populate("products.productId", "title price image");

    res.json(cart);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   DELETE /api/cart/:userId
// @desc    Clear cart
// @access  Private
router.delete("/:userId", async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.params.userId });
    res.json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
