import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signupUser = async (req, res) => {
  try {
    const {
      fullname,
      username,
      email,
      gender,
      phoneNumber,
      password,
      confirmPassword,
    } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Password doesn't match" });
    }

    const userExisted = await User.findOne({ username });
    if (userExisted) {
      return res.status(400).json({ error: "Username already existed" });
    }

    const emailExisted = await User.findOne({ email });
    if (emailExisted) {
      return res
        .status(400)
        .json({ error: "email already used by other user" });
    }

    // HASH PASSWORD HERE
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // generate profilePic from https://avatar-placeholder.iran.liara.run/
    const boyprofilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlprofilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = new User({
      fullname,
      username,
      gender,
      password: hashedPassword,
      email,
      phoneNumber,
      profilePic: gender === "male" ? boyprofilePic : girlprofilePic,
    });

    if (newUser) {
      await newUser.save();

      generateTokenAndSetCookie(newUser._id, res); // for deployment
      res.status(201).json({
        data: {
          fullname: newUser.fullname,
          username: newUser.username,
          gender: newUser.gender,
          email: newUser.email,
          phoneNumber: newUser.phoneNumber,
          role: newUser.role,
          profilePic: newUser.profilePic,
        },
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup auth.contoller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    generateTokenAndSetCookie(user._id, res); // for deployment

    res.status(200).json({
      data: {
        email: user.email,
        fullname: user.fullname,
        username: user.username,
        phoneNumber: user.phoneNumber,
        profilePic: user.profilePic,
        gender: user.gender,
      },
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    if (user.role != "admin" && user.role != "super admin") {
      return res.status(400).json({ error: "This user isn't Admin" });
    }

    generateTokenAndSetCookie(user._id, res); // for deployment

    res.status(200).json({
      data: {
        email: user.email,
        fullname: user.fullname,
        username: user.username,
        phoneNumber: user.phoneNumber,
        profilePic: user.profilePic,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logoutUser = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
