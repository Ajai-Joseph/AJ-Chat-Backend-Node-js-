const { Op } = require("sequelize");
const db = require("../database/models");

const User = db.User;

const Message = db.Message;
exports.getChatHistory = async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: senderId, receiverId: receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching chat history", error });
  }
};

exports.sendMessage = async (req, res) => {
  const { content, senderId, receiverId, senderName } = req.body;

  try {
    const newMessage = await Message.create({
      content,
      senderId,
      receiverId,
    });
    console.log({
      ...newMessage.dataValues,
      senderName,
    });

    console.log(global.userSocketMap);
    const receiverSocketId = global.userSocketMap[receiverId];

    if (receiverSocketId) {
      global.io.to(receiverSocketId).emit("receive_message", {
        ...newMessage.dataValues,
        senderName,
      });
    }
    res.status(200).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: "Error sending message", error });
  }
};

exports.getRecentChats = async (req, res) => {
  const userId = req.user.id;

  try {
    const recentChats = await Message.findAll({
      where: {
        [Op.or]: [{ senderId: userId }, { receiverId: userId }],
      },
      order: [["createdAt", "DESC"]],
    });

    const uniqueChats = {};
    recentChats.forEach((message) => {
      const chatPartnerId =
        message.senderId === userId ? message.receiverId : message.senderId;

      // If this user is not already added or if the message is more recent
      if (
        !uniqueChats[chatPartnerId] ||
        uniqueChats[chatPartnerId].createdAt < message.createdAt
      ) {
        uniqueChats[chatPartnerId] = {
          id: chatPartnerId,
          message: message.content,
          createdAt: message.createdAt,
        };
      }
    });

    const chatList = await Promise.all(
      Object.values(uniqueChats).map(async (chat) => {
        const user = await User.findByPk(chat.id, {
          attributes: ["id", "name", "email", "profileImageUrl"],
        });

        return {
          receiverId: user.id,
          receiverName: user.name,
          receiverEmail: user.email,
          receiverImage: user.profileImageUrl,
          lastMessage: chat.message,
          createdAt: chat.createdAt,
        };
      })
    );

    res.json(chatList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
