import express from "express";
import { GetAllProducts } from "../controllers/product.controller.js";
import { checkLogin } from "../middleware/authController.js";
import { MineDataWithAllProducts } from "../controllers/start.controller.js";
import { OnlyMineData } from "../middleware/onlyMineData.js";

const router = express.Router();

router.get("/", GetAllProducts);
router.get("/:username", checkLogin, OnlyMineData, MineDataWithAllProducts);
export default router;
