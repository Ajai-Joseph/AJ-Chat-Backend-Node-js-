const express = require("express");
const {
  getChatHistory,
  sendMessage,
  getRecentChats,
} = require("../controllers/messageController");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.get('/getChatHistory', verifyToken, getChatHistory);
router.post('/sendMessage', verifyToken, sendMessage);
router.get("/recentChats",verifyToken, getRecentChats);

module.exports = router;
