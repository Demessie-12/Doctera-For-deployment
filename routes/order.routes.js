import express from "express";
import {
  CreateOrder,
  GetSingleOrder,
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/", CreateOrder);
router.get("/:orderId", GetSingleOrder);

export default router;
