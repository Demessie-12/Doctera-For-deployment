import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";

export const checkLogin = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized - No token provide" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res
        .status(401)
        .json({ error: "Unauthorized - Invalid token provide" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log("Error in checkLogin middleware", error.message);
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "You don't have permission to take this action" });
    }
    next();
  };
};

export const restrictToCreatorOr = (...roles) => {
  return async (req, res, next) => {
    const product = await Product.findOne({
      productId: req.params.ProductID,
    });

    const logged = await User.findById(req.user._id);

    if (product?.creator === logged.username) {
      console.log("hi");
      return next();
    }

    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "You don't have permission to take this action" });
    }
    next();
  };
};
