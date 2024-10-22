const express = require("express");
const {
  register,
  login,
  getAllUsers,
  logout,
  getProfileImage,
} = require("../controllers/userController");
const { verifyToken } = require("../middleware/auth");
const upload = require("../middleware/upload");
const router = express.Router();

router.post("/register", upload.single("profileImage"), register);
router.post("/login", login);
router.get("/getAllUsers", verifyToken, getAllUsers);
router.get("/getProfileImage", verifyToken, getProfileImage);

router.post("/logout", verifyToken, logout);

module.exports = router;
