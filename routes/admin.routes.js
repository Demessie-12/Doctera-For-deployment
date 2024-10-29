const express = require("express");
const {
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
} = require("../controllers/admin.controller.js");

const { restrictTo } = require("../middleware/authController.js");

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

module.exports = router;
