import Review from "../models/review.model.js";

export const CreateReview = async (req, res) => {
  try {
    const { product, productId, rating, review } = req.body;
    // product should be product's mongodb ID using from product._id

    const reviewer = req.user._id;
    const reviewId = req.user.username.concat("_", productId);

    const existedReview = await Review.findOne({ reviewId: reviewId });
    if (existedReview) {
      return res
        .status(400)
        .json({ error: "You already review this item. you can edit it" });
    }
    const newReview = await new Review({
      reviewId,
      reviewer,
      product,
      rating,
      review,
    });

    newReview.save();

    res.status(400).json({ data: newReview });
  } catch (error) {
    console.log("Error in CreateReview, review.contoller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const GetAllReviews = async (req, res) => {
  try {
    const AllReviews = await Review.find();

    res.status(200).json({ data: AllReviews });
  } catch (error) {
    console.log("Error in GetAllReviews, review.contoller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const GetReviewsById = async (req, res) => {
  try {
    const { _id } = req.params;

    const review = await Review.findOne({ _id });
    if (!review) {
      return res.status(404).json({ error: "No review found in this Id" });
    }

    res.status(200).json({ data: review });
  } catch (error) {
    console.log(
      "Error in GetReviewsByReviewId, review.contoller",
      error.message
    );
    res.status(500).json({ error: "Internal server error" });
  }
};

export const DeleteReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const deleted = await Review.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "No Review found in this Id" });
    }

    res.status(200).json({ message: "Review Deleted succesfully" });
  } catch (error) {
    console.log("Error in DeleteReviewById, review.contoller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
