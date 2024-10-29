const express = require("express");
const {
  DeleteProduct,
  EditProduct,
  GetAllProducts,
  GetProductsByCategory,
  GetSingleProduct,
  PostProduct,
} = require("../controllers/product.controller.js");
const {
  checkLogin,
  restrictTo,
  restrictToCreatorOr,
} = require("../middleware/authController.js");

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

module.exports = router;
