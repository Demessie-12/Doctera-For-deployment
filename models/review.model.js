import mongoose from "mongoose";
import Product from "./product.model.js";

const reviewSchema = mongoose.Schema(
  {
    reviewId: {
      type: String,
      required: [true, "Review must have unique Id"],
      unique: true,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to specific Product"],
    },
    reviewer: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
    rating: {
      type: Number,
      required: true,
      max: [5, "rating must be below 5"],
      min: [1, "rating must be above 1"],
    },
    review: {
      type: String,
      required: [true, "Review can not be empty!"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "reviewer",
    select: "fullname username profilePic",
  });
  next();
});

// Middleware to update rating quantity and average when new review added
reviewSchema.statics.calcAverageRatings = async function (product_Id) {
  const stats = await this.aggregate([
    {
      $match: { product: product_Id },
    },
    {
      $group: {
        _id: "$product",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  console.log(stats);
  await Product.findByIdAndUpdate(product_Id, {
    ratingsQuantity: stats[0].nRating,
    ratingsAverage: stats[0].avgRating,
  });
};

reviewSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.product);
});

// update review avarage when review deleted or updated
reviewSchema.pre(/^findByIdAndDelete/, async function (next) {
  this.r = await this.findOne();
  next();
});
reviewSchema.post(/^findByIdAndDelete/, async function () {
  await this.r.constructor.calcAverageRatings(this.r.product);
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;
