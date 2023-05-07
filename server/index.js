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
    origin: ["http://localhost:5000", "https://tambola-new.vercel.app/"],
    methods: ["GET", "POST"],
  },
});

const users = {};
let number = "";
let numbersAlreadyDone = [];
let rewards = [
  "Quick Five",
  "Corners",
  "First Row",
  "Second Row",
  "Third Row",
  "First Fullhouse",
  "Second Fullhouse",
];

// Listen for when the client connects via socket.io-client
io.on("connection", (socket) => {
  socket.on("connected", () => {
    socket.emit("get-users", Object.values(users));
    socket.emit("get-number", number, numbersAlreadyDone);
  });

  socket.on("new-user", (name) => {
    users[socket.id] = {
      id: socket.id,
      name,
      resultMessage: "",
    };
    socket.broadcast.emit("user-connected", users[socket.id]);
  });

  socket.on("game-started", (name) => {
    socket.broadcast.emit("user-started-game", name);
  });

  socket.on("set-number", (newNumber) => {
    number = newNumber;
    numbersAlreadyDone = [...numbersAlreadyDone, number];
    socket.broadcast.emit("get-number", number);
  });

  socket.on("set-remaining-rewards", (reward) => {
    rewards = rewards.filter((r) => r !== reward);
    socket.broadcast.emit("get-remaining-rewards", rewards);
  });

  socket.on("update-users-with-new-result", (reward) => {
    const updatedUser = {
      ...users[socket.id],
      resultMessage: reward,
    };
    socket.broadcast.emit("set-users-with-new-result", updatedUser);
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnected", users[socket.id]);
    delete users[socket.id];
  });
});

server.listen(8000, () => "Server is running on port 8000");
