import express from "express";
import {
  getAnalyticsSummary,
  getAnalyticsTrends,
} from "../controllers/analytics.controller.js";
import { verifyAdmin, verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/summary", verifyJWT, verifyAdmin, getAnalyticsSummary);
router.get("/trends", verifyJWT, verifyAdmin, getAnalyticsTrends);

export default router;
