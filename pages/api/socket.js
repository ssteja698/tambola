import { Server } from "socket.io";

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

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

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
  }
  res.end();
};

export default SocketHandler;
