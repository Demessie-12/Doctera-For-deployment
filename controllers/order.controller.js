const Order = require("../models/order.model.js");
const Product = require("../models/product.model.js");
const User = require("../models/user.model.js");
const jwt = require("jsonwebtoken");
const Chapa = require("chapa");

const CreateOrder = async (req, res) => {
  try {
    const { customer, phone, cart, address, position } = req.body;
    var cartPrice = [];

    const AllOrders = await Order.find();
    const Products = await Product.find();

    await cart.map((CartItem, i) => {
      const SingleProduct = Products.find(
        (element) => element.productId == CartItem.productId
      );
      const productPrice = CartItem.quantity * SingleProduct.newPrice;
      cartPrice.push(productPrice);
      return productPrice;
    });

    var date = new Date();
    // add  day based on address
    const transportDate = address.includes("Addis Ababa") ? 1 : 2;
    date.setDate(date.getDate() + transportDate);

    // If user is logged in add username to order
    const token = req.cookies.jwt;
    let decoded;
    let user;
    if (token) {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    }

    if (decoded) {
      user = await User.findById(decoded.userId).select("-password");
    }

    const customerUsername = user?.username || "Unknown";

    // Creating Payment
    let chapaId;
    let chapaUrl;

    let myChapa = new Chapa(process.env.CHAPA_SECRET_KEY);
    const customerInfo = {
      amount: cartPrice.reduce((sum, item) => sum + item, 0),
      currency: "ETB",
      email: customerUsername + "@gmail.com",
      first_name: customer,
      last_name: " ",
      // tx_ref: 'tx-x12345', // if autoRef is set in the options we dont't need to provide reference, instead it will generate it for us
      callback_url: "http://localhost:5174/", // your callback URL
      customization: {
        title: "I love e-commerce",
        description: "It is time to pay",
      },
    };

    await myChapa
      .initialize(customerInfo, { autoRef: true })
      .then((response) => {
        /*
        response:
          {
            message: 'Hosted Link',
            status: 'success' || 'failed',
            data: {
              checkout_url: 'https://checkout.chapa.co/checkout/payment/:token'
            },
            tx_ref: 'generated-token' // this will be the auto generated reference
          }
        */
        chapaId = response.tx_ref;
        chapaUrl = response.data.checkout_url;
        // console.log(response, response.tx_ref);
        // saveReference(response.tx_ref)
      })
      .catch((e) => console.log(e));

    // Saving orderData in Database
    const newOrder = await new Order({
      orderId: 11000 + AllOrders.length,
      customerUsername,
      customerName: customer,
      customerPhoneNo: Number(phone),
      products: cart,
      totalPrice: cartPrice.reduce((sum, item) => sum + item, 0),
      dateOfDelivery: date,
      address,
      ipLocation: position.split(", "),
      chapaId,
      chapaUrl,
    });

    newOrder.save();

    res.status(400).json({ data: newOrder });
  } catch (error) {
    console.log("Error in CreateOrder order.contoller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const GetSingleOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const singleOrder = await Order.findOne({ orderId }).select([
      "-_id",
      "-customerName",
      "-customerPhoneNo",
      "-ipLocation",
    ]);

    if (!singleOrder)
      return res
        .status(404)
        .json({ error: `NO Order found with ${orderId} Id` });

    let paymentStatus;
    {
      /*
      Check Paymnet State on Chapa
    let myChapa = new Chapa(process.env.CHAPA_SECRET_KEY);
    await myChapa
      .verify(singleOrder?.chapaId)
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

module.exports = { CreateOrder, GetSingleOrder };
