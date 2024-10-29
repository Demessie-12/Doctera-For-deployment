const Product = require("../models/product.model.js");

const GetAllProducts = async (req, res) => {
  try {
    const Products = await Product.find({ status: "Verified" }).populate(
      "reviews"
    );

    res.status(200).json({
      data: Products,
    });
  } catch (error) {
    console.log("Error in GetAllProducts controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const GetProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const categoryProducts = await Product.find({
      category: category,
    });
    if (!categoryProducts)
      return res
        .status(404)
        .json({ message: `No product found in ${category} category` });

    res.status(200).json({ data: categoryProducts });
  } catch (error) {
    console.log(
      "Error in GetProductByCategory product.contoller",
      error.message
    );
    res.status(500).json({ error: "Internal server error" });
  }
};

const GetSingleProduct = async (req, res) => {
  try {
    const { ProductID } = req.params;
    console.log(ProductID);
    const SingleProduct = await Product.findOne({ productId: ProductID });
    if (!SingleProduct)
      return res
        .status(404)
        .json({ message: `NO Product found with ${ProductID} ID` });

    res.status(200).json({ data: SingleProduct });
  } catch (error) {
    console.log("Error in GetSingleProduct product.contoller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const PostProduct = async (req, res) => {
  try {
    const creator = req.user.username;
    const creatorPhone = req.user.phoneNumber;

    const {
      name,
      category,
      quantity,
      description,
      detail,
      condition,
      newPrice,
      coverImage,
      images,
      mainCategory,
      tags,
    } = req.body;

    const ProductList = await Product.find();

    // Get number form last Product from A096 => 96
    const lastProductIdNo = Number(
      ProductList[ProductList.length - 1].productId.substring(1)
    );
    // First plus 1 and Add 0 in prefix then add letter A
    const productId = "A" + (lastProductIdNo + 1).toString().padStart(3, "0");

    const newProduct = new Product({
      productId,
      name,
      creator,
      creatorPhone,
      category,
      quantity,
      description,
      detail,
      condition,
      newPrice,
      coverImage,
      images,
      mainCategory,
      tags,
    });

    await newProduct.save();

    res.status(201).json({
      data: newProduct,
    });
  } catch (error) {
    console.log("Error in PostProduct product.contoller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const EditProduct = async (req, res) => {
  try {
    const { ProductID } = req.params;
    const selectedProduct = await Product.findOne({ productId: ProductID });
    if (!selectedProduct)
      return res
        .status(404)
        .json({ message: `NO Product found with ${ProductID} ID` });
    const {
      productId,
      name,
      category,
      quantity,
      description,
      detail,
      condition,
      newPrice,
      oldPrice,
      coverImage,
      tags,
      images,
      mainCategory,
    } = req.body;

    const ExistedProductID = await Product.findOne({
      productId,
      _id: { $ne: selectedProduct._id },
    });
    if (ExistedProductID) {
      return res
        .status(400)
        .json({ error: "ProductId already used for other product" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      selectedProduct._id,
      {
        productId,
        name,
        category,
        quantity,
        description,
        detail,
        condition,
        newPrice,
        oldPrice,
        coverImage,
        tags,
        images,
        mainCategory,
      },
      {
        new: true,
      }
    );
    // await updatedProduct.save();
    res.status(200).json({ data: updatedProduct });
  } catch (error) {
    console.log("Error in EditProduct product.contoller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const DeleteProduct = async (req, res) => {
  try {
    const { ProductID } = req.params;
    const selectedProduct = await Product.findOne({ productId: ProductID });
    const deleted = await Product.findByIdAndDelete(selectedProduct._id);
    if (!deleted)
      return res.status(200).json({ message: "Can't found any product" });
    res.status(200).json({
      message: "Deleted Successfully",
    });
  } catch (error) {
    console.log("Error in DeleteProduct product.contoller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  GetAllProducts,
  GetProductsByCategory,
  GetSingleProduct,
  PostProduct,
  EditProduct,
  DeleteProduct,
};
