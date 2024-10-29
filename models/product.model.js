const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      index: { unique: true },
    },
    creator: {
      type: String,
      required: [true, "A product must have CreatorID"],
    },
    creatorPhone: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: [true, "A product must have a name"],
      minLength: 3,
      trim: true,
    },
    slug: {
      type: String,
    },
    category: [
      {
        type: String,
        required: [true, "A product must have a category"],
      },
    ],
    quantity: {
      type: Number,
      default: 1,
    },
    description: {
      type: String,
      required: [true, "A product must have a description"],
      trim: true, // trim set on String type to remove starting and ending whitespace from text
    },
    detail: {
      type: String,
      trim: true,
    },
    mainCategory: {
      type: String,
    },
    condition: {
      type: String,
      required: [true, "A product must have a condition"],
      enum: ["Brand New", "New condition", "Slightly Used", "Used"],
    },
    newPrice: {
      type: Number,
      required: [true, "A product must have a price"],
    },
    oldPrice: {
      type: Number,
      // set: () => this.newPrice * 0.85,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1"],
      max: [5, "Rating must be below 5"],
    },
    ratingsQuantity: {
      type: Number,
      default: 1,
    },
    coverImage: {
      type: String,
      required: [true, "A product must have a covoer image"],
    },
    images: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ["Pending", "Verified"],
      default: "Pending",
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true }
);

// Vertula Populate
productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});

// Middleware run before .save() and .create()

productSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  // this.__v >= 0 ? next() : (this.tags = this.tags?.concat(this.slug.split("-")));
  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
