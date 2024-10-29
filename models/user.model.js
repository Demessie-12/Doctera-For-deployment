import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    role: {
      type: String,
      default: "customer",
      enum: ["customer", "merchant", "admin", "super admin"],
    },
    address: {
      type: String,
    },
    companyName: {
      type: String,
    },
    orders: {
      type: mongoose.Types.ObjectId,
      ref: "Order",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
