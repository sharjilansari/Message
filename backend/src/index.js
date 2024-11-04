import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Replace with your frontend URL
    methods: ["GET", "POST"], // Specify allowed HTTP methods
    credentials: true, // Allows cookies to be sent with requests if needed
  },
});

app.use(cors({
  origin: "http://localhost:3000"
}));

const userSockets = {}; // Store users and their socket IDs

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId; // Retrieve userId from query
  userSockets[userId] = socket.id; // Store socket ID for the user
  console.log(`User connected: ${userId}, Socket ID: ${userSockets[userId]}`);

  socket.on("privateMessage", (data) => {
    const targetSocketId = userSockets[data.to]; // Get the target user's socket ID
    console.log(`From ${data.from} Socket ID: ${userSockets[data.from]} to ${data.to} Socket ID: ${targetSocketId}`, );
    console.log("Message:", data.message);
      io.to(targetSocketId).emit("privateMessage",{from: data.from,message: data.message}); // Send private message
  });

  socket.on("disconnect", () => {
    delete userSockets[userId]; // Remove user from userSockets on disconnect
    console.log(`User disconnected: ${userId}`);
  });
});

server.listen(5000, () => {
  console.log('Server is listening on port 5000');
});
