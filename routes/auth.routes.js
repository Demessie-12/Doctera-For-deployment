const express = require("express");
const {
  signupUser,
  loginUser,
  logoutUser,
  updateMyProfile,
  updateMyPassword,
  loginAdmin,
} = require("../controllers/auth.controllers.js");

const { checkLogin } = require("../middleware/authController.js");

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/loginAdmin", loginAdmin);
router.patch("/profile/:username", checkLogin, updateMyProfile);
router.patch("/password/:username", checkLogin, updateMyPassword);

router.get("/logout", logoutUser);

module.exports = router;
