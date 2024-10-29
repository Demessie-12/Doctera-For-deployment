const express = require("express");
const { CreatePayment } = require("../controllers/payment.controller.js");

const router = express.Router();
router.post("/create", CreatePayment);

module.exports = router;
