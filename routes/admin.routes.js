import express from "express";
import {
  DeleteProductById,
  EditOrderStatus,
  EditProductStatus,
  EditUserRole,
  GetAllOrders,
  GetAllProductsForAdmin,
  GetAllUsers,
  GetDashboardData,
  GetProductByStatus,
  GetSingleOrderDetail,
  GetSingleUser,
  GetUsersByCategory,
} from "../controllers/admin.controller.js";
import { restrictTo } from "../middleware/authController.js";

const router = express.Router();

router.get("/dashboard", GetDashboardData);
router.get("/users", GetAllUsers);
router.get("/users/c/:category", GetUsersByCategory);
router.get("/users/:username", GetSingleUser);
router.patch("/users/:username", restrictTo("super admin"), EditUserRole);

router.get("/products", GetAllProductsForAdmin);
router.get("/products/status/:status", GetProductByStatus);
router.patch("/products/status/:productId", EditProductStatus);
router.delete("/products/delete/:id", DeleteProductById);

router.get("/orders", GetAllOrders);
router.get("/orders/:orderId", GetSingleOrderDetail);
router.patch("/orders/:orderId", EditOrderStatus);

export default router;
