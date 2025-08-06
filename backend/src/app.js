import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// __dirname workaround in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));

// Routes
import productRoutes from "./routes/product.route.js";
import userRoutes from "./routes/user.route.js";
import cartRoutes from "./routes/cart.route.js";

app.use("/api/products", productRoutes);
app.use("/api/user", userRoutes);
app.use("/api/cart", cartRoutes);

// Serve static files from frontend/dist
app.use(express.static(path.join(__dirname, "frontend", "dist")));

app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

export default app;
