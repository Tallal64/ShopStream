import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { createCheckoutSession } from "../controllers/order.controller.js";

const router = express.Router();

router.post("/checkout", verifyJWT, createCheckoutSession);

export default router;
