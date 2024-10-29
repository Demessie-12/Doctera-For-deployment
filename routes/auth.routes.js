const express = require("express");
const {
  signupUser,
  loginUser,
  logoutUser,
  loginAdmin,
} = require("../controllers/auth.controllers.js");

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/loginAdmin", loginAdmin);
router.get("/logout", logoutUser);

module.exports = router;
