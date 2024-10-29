const express = require("express");
const {
  CreateReview,
  DeleteReviewById,
  GetAllReviews,
  GetReviewsById,
} = require("../controllers/review.controller.js");
const { checkLogin } = require("../middleware/authController.js");

const router = express.Router();

router.get("/", GetAllReviews);
router.post("/new", checkLogin, CreateReview);
router.get("/:_id", GetReviewsById);
router.delete("/d/:id", DeleteReviewById);

module.exports = router;
