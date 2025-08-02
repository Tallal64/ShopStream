import mongoose from "mongoose";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";

export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(404).json({ error: "Invalid user ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const qty = typeof quantity === "number" && quantity > 0 ? quantity : 1;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({ error: "Product does not exist" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [{ product: productId, quantity: qty }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId.toString()
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += qty;
      } else {
        cart.items.push({ product: productId, quantity: qty });
      }
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Item added to cart successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Server error:", error);
    return res
      .status(500)
      .json({ error: "Something went wrong while adding to cart" });
  }
};

export const getUserCart = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const cart = await Cart.findOne({ user: userId })
      .populate("items.product")
      .lean();

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const TAX_RATE = 0.08; // 8% tax
    const SHIPPING_FEE = 0; // Flat rate (can be customized later)

    let subtotal = 0;

    cart.items.forEach((item) => {
      if (item.product && item.product.price) {
        subtotal += item.product.price * item.quantity;
      }
    });

    const tax = +(subtotal * TAX_RATE).toFixed(2);
    const total = +(subtotal + tax + SHIPPING_FEE).toFixed(2);

    const allProductsDeleted = cart.items.every(
      (item) => !item.product || !item.product._id
    );

    if (allProductsDeleted || cart.items.length === 0) {
      await Cart.findByIdAndDelete(cart._id);
      return res
        .status(200)
        .json({ success: true, message: "Cart is empty", data: null });
    }

    return res.status(200).json({
      success: true,
      message: "Cart retrieved successfully",
      data: {
        ...cart,
        pricingSummary: {
          subtotal,
          tax,
          shipping: SHIPPING_FEE,
          total,
        },
      },
    });
  } catch (error) {
    console.error("Server error:", error);
    return res
      .status(500)
      .json({ error: "Something went wrong while retrieving cart" });
  }
};

export const updateCartItemQuantity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { _id: productId } = req.params;
    const { newQuantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(404).json({ error: "Invalid user ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    if (!newQuantity || typeof newQuantity !== "number" || newQuantity < 1) {
      return res
        .status(400)
        .json({ error: "Quantity must be a number and at least 1" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({ error: "Product does not exist" });
    }

    // Find user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Find index of the product in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId.toString()
    );

    // If product not in cart
    if (itemIndex === -1) {
      return res.status(404).json({ error: "Product not found in cart" });
    }

    // Update quantity
    cart.items[itemIndex].quantity = newQuantity;

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart item quantity updated successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Server error:", error);
    return res
      .status(500)
      .json({ error: "Something went wrong while updating cart" });
  }
};

export const removeItemFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { _id: productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const product = await Product.findById(productId).lean();
    if (!product) {
      return res.status(400).json({ error: "Product does not exist" });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // check if the product exists in the cart
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId.toString()
    );

    if (itemIndex === -1) {
      return res.status(404).json({ error: "Product not found in cart" });
    }

    const updatedCart = await Cart.findOneAndUpdate(
      { user: userId },
      { $pull: { items: { product: productId } } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Item removed from cart",
      data: updatedCart,
    });
  } catch (error) {
    console.error("Server error:", error);
    return res
      .status(500)
      .json({ error: "Something went wrong while deleting the item" });
  }
};
