import express from "express";
import { CreatePayment } from "../controllers/payment.controller.js";

const router = express.Router();
router.post("/create", CreatePayment);

export default router;
