const express = require("express");
const { GetAllProducts } = require("../controllers/product.controller.js");
const { checkLogin } = require("../middleware/authController.js");
const {
  MineDataWithAllProducts,
} = require("../controllers/start.controller.js");
const { OnlyMineData } = require("../middleware/onlyMineData.js");

const router = express.Router();

router.get("/", GetAllProducts);
router.get("/:username", checkLogin, OnlyMineData, MineDataWithAllProducts);
module.exports = router;
