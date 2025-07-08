import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: "Access token required - please login" 
      });
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          success: false,
          error: "Access token expired",
          tokenExpired: true
        });
      }
      return res.status(401).json({ 
        success: false,
        error: "Invalid access token" 
      });
    }

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: "User not found - invalid access token" 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ 
      success: false,
      error: "Unauthorized request" 
    }); 
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
