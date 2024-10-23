const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/user");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = new User({ username, password: hashedPassword, email });
    await user.save();

    res.json({
      message: "User Registered Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error Registering User",
    });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user)
    return res.status(400).json({
      message: "User Not Found",
    });

  const match = await bcrypt.compare(password, user.password);

  if (!match)
    return res.status(400).json({
      message: "Invalid Credentials",
    });

  const token = jwt.sign(
    {
      id: user._id,
    },
    JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.json({
    message: "Login Successful",
    token: token,
  });
});

const tokenVerify = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({
      message: "No Token Detected, Auth Unsuccessful",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({
      message: "Token is not Valid",
    });
  }
};

router.get("/private-route", tokenVerify, (req, res) => {
  res.json({
    message: "Login Successful, Welcome to the Private Route!",
    userId: req.user,
  });
});

module.exports = router;
