import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

// importing routes
import productRoutes from "./routes/product.route.js";
import userRoutes from "./routes/user.route.js";
import cartRoutes from "./routes/cart.route.js";
import orderRoutes from "./routes/order.routes.js";
import webhookRoutes from "./routes/webHook.route.js";

const app = express();
const __dirname = path.resolve();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Stripe webhook must come before express.json() because it needs the raw body for signature verification (stripe requirement)
app.use("/api/v1/webhook", webhookRoutes);

app.use(express.json()); // middleware to expect JSON data

// App routes
app.use("/api/products", productRoutes);
app.use("/api/user", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);

app.use(express.static(path.join(__dirname, "frontend/dist")));
app.get("*", (_, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

export default app;
