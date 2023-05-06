require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

app.use(cors()); // Add cors middleware

const server = http.createServer(app); // Add this

// Create an io server and allow for CORS from http://localhost:5000 with GET and POST methods
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5000",
    methods: ["GET", "POST"],
  },
});

const users = {};
let allUsers = []; // All users in current chat room
let number = {};
let numbersAlreadyDone = {};
let rewards = [
  "Quick Five",
  "Corners",
  "First Row",
  "Second Row",
  "Third Row",
  "First Fullhouse",
  "Second Fullhouse",
];
let chatRoom = "";

// Listen for when the client connects via socket.io-client
io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);

  socket.on("join_room", ({ username, room }) => {
    console.log(username, room, "*40");
    socket.join(room);
    let currUser = { id: socket.id, name: username, room, result_message: "" };
    socket.to(room).emit("user_connected", currUser);
    chatRoom = room;
    allUsers.push(currUser);
    chatRoomUsers = allUsers.filter((user) => user.room === room);
    io.in(room).emit("get_users", chatRoomUsers);
    users[socket.id] = currUser;
    if (number?.[room] && numbersAlreadyDone?.[room]) {
      io.in(room).emit("get_number", number[room], numbersAlreadyDone[room]);
    }
  });

  socket.on("leave_room", ({ name, room }) => {
    socket.leave(room);
    // Remove user from memory
    const user = Object.values(users).find(
      (u) => u.name === name && u.room === room
    );
    if (user) {
      socket.to(room).emit("user_disconnected", users[user.id]);
      delete users[user.id];
    }
  });

  socket.on("game_started", ({ name, room }) => {
    socket.to(room).emit("user_started_game", name);
  });

  socket.on("set_number", ({ newNumber, room }) => {
    number = { ...number, [room]: newNumber };
    numbersAlreadyDone = {
      ...numbersAlreadyDone,
      [room]: [...(numbersAlreadyDone[room] || []), number[room]],
    };
    socket.to(room).emit("get_number", number[room]);
  });

  socket.on("set_remaining_rewards", ({ result_message, roomCode }) => {
    rewards = rewards.filter((r) => r !== result_message);
    socket.to(roomCode).emit("get_remaining_rewards", rewards);
  });

  socket.on("update_users_with_new_result", ({ result_message, roomCode }) => {
    const updatedUser = {
      ...users[socket.id],
      result_message,
      room: roomCode,
    };
    socket.to(roomCode).emit("set_users_with_new_result", updatedUser);
  });

  socket.on("disconnect", () => {
    socket.to(chatRoom).emit("user_disconnected", users[socket.id]);
    delete users[socket.id];
  });
});

server.listen(8000, () => "Server is running on port 8000");
