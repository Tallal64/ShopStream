import express from "express";
import {
  createProduct,
  getAllProducts,
  getProduct,
  deleteProducts,
  updateProduct,
  getProductsByCategory,
} from "../controllers/product.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyAdmin, verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", verifyJWT, verifyAdmin, upload.single("image"), createProduct);
router.get("/", getAllProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/:Id", getProduct);
router.delete("/:Id", verifyJWT, verifyAdmin, deleteProducts);
router.put(
  "/:Id",
  verifyJWT,
  upload.single("image"),
  verifyAdmin,
  updateProduct
);

export default router;
