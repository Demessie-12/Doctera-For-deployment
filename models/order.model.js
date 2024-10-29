const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    orderId: {
      type: Number,
      required: [true, "An order must have unique ID"],
      unique: true,
    },
    customerUsername: {
      type: String,
      required: [
        true,
        "An order must have defined customer username or unknown",
      ],
    },
    customerName: {
      type: String,
      minLength: 3,
      required: [true, "An order must have defined customer Name"],
    },
    customerPhoneNo: {
      type: Number,
      minLength: 10,
      maxlength: 13,
      required: [true, "An order must have defined customer Phone Number"],
    },
    products: [
      {
        productId: String,
        name: String,
        coverImage: String,
        price: Number,
        quantity: Number,
        totalPrice: Number,
      },
    ],
    totalPrice: {
      type: Number,
      requried: [true, "An order must have total price"],
    },
    dateOfDelivery: {
      type: Date,
      required: [true, "An order must have dateOfDelivery"],
    },
    status: {
      type: String,
      enum: ["Delivered", "On delivery", "Waiting"],
      default: "Waiting",
    },
    address: String,
    ipLocation: [Number],
    reviews: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reviews",
    },
    chapaId: {
      type: String,
      required: [true, "An order must have unique Chapa ID"],
      unique: true,
    },
    chapaUrl: {
      type: String,
      required: [true, "An order must have unique Chapa Url"],
      unique: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
