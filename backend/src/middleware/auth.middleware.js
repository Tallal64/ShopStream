import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "please login" });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      return res.status(401).json({ error: "invalid access token" });
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ error: "unauthorized request" }); 
  }
};

export const verifyAdmin = (req, res, next) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ success: false, message: "Not authenticated!" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Access denied!" });
  }

  next();
};
