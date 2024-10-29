import express from "express";
import {
  CreateReview,
  DeleteReviewById,
  GetAllReviews,
  GetReviewsById,
} from "../controllers/review.controller.js";
import { checkLogin } from "../middleware/authController.js";

const router = express.Router();

router.get("/", GetAllReviews);
router.post("/new", checkLogin, CreateReview);
router.get("/:_id", GetReviewsById);
router.delete("/d/:id", DeleteReviewById);

export default router;
