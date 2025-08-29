import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  createCheckoutSession,
  getAllUserOrders,
  getOrderBySessionId,
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/checkout", verifyJWT, createCheckoutSession);
router.get("/my-orders", verifyJWT, getAllUserOrders);
router.get("/by-session/:sessionId", verifyJWT, getOrderBySessionId);

export default router;
