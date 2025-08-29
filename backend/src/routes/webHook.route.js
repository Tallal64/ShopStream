import express from "express";
import { webHookHandler } from "../controllers/webHook.controller.js";

const router = express.Router();

router.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  webHookHandler
);

export default router;
