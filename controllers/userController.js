const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../database/models");

const User = db.User;
// User Registration
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const profileImageUrl = req.file
    ? `/uploads/profile_images/${req.file.filename}`
    : null;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImageUrl,
    });
    global.io.emit("new_user_added", newUser.dataValues);
    return res
      .status(200)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error registering user", error });
  }
};

// User Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    res.status(200).json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "profileImageUrl"],
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};
exports.getProfileImage = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      profileImageUrl: user.profileImageUrl || "No profile image available",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving profile image", error });
  }
};

exports.logout = (req, res) => {
  const userId = req.user.id;
  if (global.userSocketMap[userId]) {
    const socketId = global.userSocketMap[userId];

    delete global.userSocketMap[userId];

    console.log(
      `User with ID: ${userId} logged out, socket ID: ${socketId} removed, cuurent userSocketMap:${global.userSocketMap}`
    );

    res.status(200).json({ message: "User logged out successfully" });
  } else {
    res.status(400).json({ message: "User is not registered with a socket" });
  }
};
