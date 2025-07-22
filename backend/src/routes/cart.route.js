import express from "express";
import {
  addToCart,
  getUserCart,
  removeItemFromCart,
  updateCartItemQuantity,
} from "../controllers/cart.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", verifyJWT, addToCart);
router.put("/:_id", verifyJWT, updateCartItemQuantity);
router.get("/", verifyJWT, removeItemFromCart);
router.delete("/:_id", verifyJWT, getUserCart);

export default router;
