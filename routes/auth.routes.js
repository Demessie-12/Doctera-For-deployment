import express from "express";

import {
  signupUser,
  loginUser,
  logoutUser,
  loginAdmin,
} from "../controllers/auth.controllers.js";
const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/loginAdmin", loginAdmin);
router.get("/logout", logoutUser);

export default router;
