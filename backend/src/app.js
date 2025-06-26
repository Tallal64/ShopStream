import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json()); // accept data from user/frontend
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());

export default app;

// importing routes
import productRoutes from "./routes/product.route.js";
import userRoutes from "./routes/user.route.js";

app.use("/api/products", productRoutes);
app.use("/api/user", userRoutes);
