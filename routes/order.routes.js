const express = require("express");
const {
  CreateOrder,
  GetSingleOrder,
} = require("../controllers/order.controller.js");

const router = express.Router();

router.post("/", CreateOrder);
router.get("/:orderId", GetSingleOrder);

module.exports = router;
