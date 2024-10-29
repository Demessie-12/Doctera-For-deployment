const Product = require("../models/product.model.js");

const MineDataWithAllProducts = async (req, res) => {
  try {
    const Products = await Product.find({ status: "Verified" }).populate(
      "reviews"
    );

    res.status(200).json({
      mineOrders: req.orders,
      data: Products,
    });
  } catch (error) {
    console.log("Error in GetAllProducts controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { MineDataWithAllProducts };
