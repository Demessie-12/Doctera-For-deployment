const Order = require("../models/order.model.js");
const Product = require("../models/product.model.js");
const User = require("../models/user.model.js");

const Chapa = require("chapa");

const GetDashboardData = async (req, res) => {
  try {
    const Users = await User.find().select("-password");
    const RecentUsers = Users.filter(
      (user, i) =>
        Math.round(
          (Date.now() - new Date(user?.createdAt || 2023 - 10 - 28)) /
            (1000 * 3600 * 24)
        ) <= 7
    );

    const Products = await Product.find();
    const RecentProducts = Products.filter(
      (product, i) =>
        Math.round(
          (Date.now() - new Date(product?.createdAt || 2023 - 10 - 28)) /
            (1000 * 3600 * 24)
        ) <= 7
    );

    const Orders = await Order.find();
    const RecentOrders = Orders.filter(
      (order, i) =>
        Math.round(
          (Date.now() - new Date(order?.createdAt || 2023 - 10 - 28)) /
            (1000 * 3600 * 24)
        ) <= 7
    );

    res.status(200).json({
      newUsers: RecentUsers,
      newProducts: RecentProducts,
      newOrders: RecentOrders,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
    console.log("Error in GetDashboardData admin.controller", error.message);
  }
};

const GetAllUsers = async (req, res) => {
  try {
    const Users = await User.find().select("-password");
    res.status(200).json({ data: Users });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
    console.log("Error in GetAllUsers admin.controller", error.message);
  }
};

const GetUsersByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const categoryUser = await User.find({ role: category }).select(
      "-password"
    );

    if (!categoryUser)
      return res
        .status(404)
        .json({ error: `NO user found in ${category} category` });

    res.status(200).json({ data: categoryUser });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
    console.log("Error in GetUsersByCategory admin.controller", error.message);
  }
};

const GetSingleUser = async (req, res) => {
  try {
    const { username } = req.params;

    const selectedUser = await User.findOne({ username }).select("-password");

    if (!selectedUser)
      return res.status(404).json({ error: "No user found in this username" });

    res.status(200).json({ UserData: selectedUser });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
    console.log("Error in GetSingleUser admin.controller", error.message);
  }
};

const GetAllProductsForAdmin = async (req, res) => {
  try {
    const Products = await Product.find().populate("reviews");

    res.status(200).json({
      data: Products,
    });
  } catch (error) {
    console.log(
      "Error in GetAllProductsForAdmin, admin.controller",
      error.message
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const GetProductByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    const products = await Product.find({ status });

    if (!products)
      return res.status(404).json({ error: "NO product found in this status" });
    res.status(200).json({ data: products });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
    console.log("Error in GetProductByStatus admin.controller", error.message);
  }
};

const EditProductStatus = async (req, res) => {
  try {
    const { productId } = req.params;
    const { status } = req.body;
    const selectedProduct = await Product.findOne({ productId: productId });

    const product = await Product.findByIdAndUpdate(
      selectedProduct._id,
      { status },
      {
        new: true,
      }
    );

    res.status(200).json({
      message: `${product.name} become ${product.status}`,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
    console.log("Error in EditProductStatus admin.controller", error.message);
  }
};

const DeleteProductById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "No Product found in this Id" });
    }

    res.status(200).json({ message: "Product Deleted succesfully" });
  } catch (error) {
    console.log("Error in DeleteProductById, review.contoller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const GetAllOrders = async (req, res) => {
  try {
    const allOrders = await Order.find();

    res.status(200).json({ data: allOrders });
  } catch (error) {
    console.log("Error in GetAllOrders admin.contoller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const GetSingleOrderDetail = async (req, res) => {
  try {
    const { orderId } = req.params;
    const singleOrder = await Order.findOne({ orderId });

    if (!singleOrder)
      return res
        .status(404)
        .json({ error: `NO Order found with ${orderId} Id` });

    let paymentStatus;
    {
      /*
    let myChapa = new Chapa(process.env.CHAPA_SECRET_KEY);
    await myChapa
      .verify(singleOrder.chapaId)
      .then((response) => {
        paymentStatus = response.data.status;
        // console.log(response); // if success
      })
      .catch((e) => console.log("not Verified")); // catch errors
*/
    }
    res.status(200).json({ data: singleOrder, paymentStatus });
  } catch (error) {
    console.log("Error in GetSingleOrder order.contoller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const EditOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const selectedOrder = await Order.findOne({ orderId });

    if (!selectedOrder)
      return res
        .staus(404)
        .json({ error: `NO order found with ${orderId} Id` });
    const updatedOrder = await Order.findByIdAndUpdate(
      selectedOrder._id,
      {
        status,
      },
      {
        new: true,
      }
    );

    res.status(200).json({ data: updatedOrder });
  } catch (error) {
    console.log("Error in GetAllOrders admin.contoller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const EditUserRole = async (req, res) => {
  try {
    const { username } = req.params;
    const { role } = req.body;
    const selectedUser = await User.findOne({ username });
    if (!selectedUser)
      return res.staus(404).json({ error: `NO User found @${username}` });
    const updatedUser = await User.findByIdAndUpdate(
      selectedUser._id,
      {
        role,
      },
      {
        new: true,
      }
    );

    res.status(200).json({ data: updatedUser });
  } catch (error) {
    console.log("Error in EditUserRole admin.contoller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  GetDashboardData,
  GetAllUsers,
  GetUsersByCategory,
  GetSingleUser,
  GetAllProductsForAdmin,
  GetProductByStatus,
  EditProductStatus,
  DeleteProductById,
  GetAllOrders,
  GetSingleOrderDetail,
  EditOrderStatus,
  EditUserRole,
};
