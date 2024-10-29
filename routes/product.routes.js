import express from "express";
import {
  DeleteProduct,
  EditProduct,
  GetAllProducts,
  GetProductsByCategory,
  GetSingleProduct,
  PostProduct,
} from "../controllers/product.controller.js";
import {
  checkLogin,
  restrictTo,
  restrictToCreatorOr,
} from "../middleware/authController.js";

const router = express.Router();

router.post(
  "/new",
  checkLogin,
  restrictTo("merchant", "admin", "super admin"),
  PostProduct
);
router.get("/", GetAllProducts);
router.get("/c/:category", GetProductsByCategory);
router.get("/:ProductID", GetSingleProduct);
router.patch(
  "/:ProductID",
  checkLogin,
  restrictToCreatorOr("admin", "super admin"),
  EditProduct
);
router.delete(
  "/:ProductID",
  checkLogin,
  restrictToCreatorOr("admin", "super admin"),
  DeleteProduct
);

export default router;
