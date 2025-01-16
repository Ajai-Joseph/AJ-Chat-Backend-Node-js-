const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const socketIO = require("socket.io");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const callRoutes = require("./routes/callRoutes");

const path = require("path");

const db = require("./database/models");

dotenv.config();
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

global.userSocketMap = {};

global.io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/calls", callRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

global.io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // When a user joins, map their user ID to the socket ID
  socket.on("register", (userId) => {
    global.userSocketMap[userId] = socket.id; // Associate user ID with socket ID
    console.log(`User ID: ${userId} registered with socket ID: ${socket.id}`);
  });

  // Join a specific room for the user (optional, if you want to use rooms)
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`User with ID: ${socket.id} joined room: ${roomId}`);
  });

  // Handle disconnection
  // socket.on("disconnect", () => {
  //   // Remove the user's socket ID from the mapping when they disconnect
  //   for (const userId in userSocketMap) {
  //     if (userSocketMap[userId] === socket.id) {
  //       delete userSocketMap[userId];
  //       console.log(
  //         `User ID: ${userId} unregistered from socket ID: ${socket.id}`
  //       );
  //       break;
  //     }
  //   }
  //   console.log("User disconnected:", socket.id);
  // });
});

try {
  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
} catch (error) {
  console.error("Unable to connect to the database:", error);
}
