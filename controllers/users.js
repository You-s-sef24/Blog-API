const User = require("../models/user");
const Token = require("../models/token");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const { validationResult } = require("express-validator");

const getAllUsers = async (req, res) => {
  const users = await User.find({}, { password: 0, __v: 0 });
  if (users.length === 0) {
    return res.status(200).json({ message: "No users found", users });
  }
  return res
    .status(200)
    .json({ message: "Users retrieved Successfully", users });
};

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({
      errors: result.array(),
    });
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ message: "User already exist" });
  }

  const hashedPassword = await bcrypt.hash(password, 8);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  await newUser.save();

  const responseUser = newUser.toObject();
  delete responseUser.password;

  return res
    .status(201)
    .json({ message: "User created succesfully", user: responseUser });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({
      errors: result.array(),
    });
  }

  const user = await User.findOne({ email }, { __v: 0 });

  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const matchedPassword = await bcrypt.compare(password, user.password);

  if (!matchedPassword) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const token = generateToken(user.email, user._id);
  const newToken = new Token({
    token,
    device: req.headers["user-agent"],
    userId: user._id,
  });
  await newToken.save();

  let responseUser = user.toObject();
  delete responseUser.password;
  responseUser = { ...responseUser, token };
  return res
    .status(200)
    .json({ message: "Logged in successfully", user: responseUser });
};

const logout = async (req, res) => {
  await Token.deleteOne({ token: req.token });
  return res.status(200).json({ message: "Logged out successfully" });
};

module.exports = {
  getAllUsers,
  register,
  login,
  logout,
};
