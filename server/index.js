require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

app.use(cors()); // Add cors middleware

class WebSocketServer {
  constructor() {
    this.users = {};
    this.number = "";
    this.numbersAlreadyDone = [];
    this.rewards = [
      "Quick Five",
      "Corners",
      "First Row",
      "Second Row",
      "Third Row",
      "First Fullhouse",
      "Second Fullhouse",
    ];

    this.server = http.createServer(app);
    this.io = new Server(this.server, {
      cors: {
        origin: ["http://localhost:5000", "https://tambola-new.vercel.app/"],
        methods: ["GET", "POST"],
      },
    });

    this.io.on("connection", (socket) => {
      socket.on("connected", () => {
        socket.emit("get-users", Object.values(this.users));
        socket.emit("get-number", this.number, this.numbersAlreadyDone);
      });

      socket.on("new-user", (name) => {
        this.users[socket.id] = {
          id: socket.id,
          name,
          resultMessage: "",
        };
        socket.broadcast.emit("user-connected", this.users[socket.id]);
      });

      socket.on("game-started", (name) => {
        socket.broadcast.emit("user-started-game", name);
      });

      socket.on("set-number", (newNumber) => {
        this.number = newNumber;
        this.numbersAlreadyDone = [...this.numbersAlreadyDone, this.number];
        socket.broadcast.emit("get-number", this.number);
      });

      socket.on("set-remaining-rewards", (reward) => {
        this.rewards = this.rewards.filter((r) => r !== reward);
        socket.broadcast.emit("get-remaining-rewards", this.rewards);
      });

      socket.on("update-users-with-new-result", (reward) => {
        const updatedUser = {
          ...this.users[socket.id],
          resultMessage: reward,
        };
        socket.broadcast.emit("set-users-with-new-result", updatedUser);
      });

      socket.on("disconnect", () => {
        socket.broadcast.emit("user-disconnected", this.users[socket.id]);
        delete this.users[socket.id];
      });
    });
  }

  start() {
    this.server.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT || 8000}`);
    });
  }

  static getInstance() {
    if (!WebSocketServer.instance) {
      WebSocketServer.instance = new WebSocketServer();
    }
    return WebSocketServer.instance;
  }
}

const webSocketServer = WebSocketServer.getInstance();
webSocketServer.start();
