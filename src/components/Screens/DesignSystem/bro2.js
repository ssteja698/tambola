import { Server } from "socket.io";

const users = {};
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

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      socket.on("connected", (room) => {
        console.log(users, "*27");
        io.in(room).emit(
          "get-users",
          Object.values(users).filter((u) => u.room === room)
        );
        io.in(room).emit(
          "get-number",
          number?.[room],
          numbersAlreadyDone?.[room]
        );
      });

      socket.on("new-user", ({ name, room }) => {
        chatRoom = room;
        socket.join(room);
        users[socket.id] = {
          id: socket.id,
          name,
          resultMessage: "",
          room,
        };
        console.log(users, room, "*41");
        socket.to(room).emit("user-connected", users[socket.id]);
      });

      socket.on("leave_room", ({ name, room }) => {
        socket.leave(room);
        // Remove user from memory
        const user = Object.values(users).find(
          (u) => u.name === name && u.room === room
        );
        if (user) {
          socket.to(room).emit("user-disconnected", users[user.id]);
          delete users[user.id];
        }
      });

      socket.on("game-started", ({ name, room }) => {
        socket.to(room).emit("user-started-game", name);
      });

      socket.on("set-number", ({ newNumber, room }) => {
        number = { ...number, [room]: newNumber };
        numbersAlreadyDone = {
          ...numbersAlreadyDone,
          [room]: [...(numbersAlreadyDone[room] || []), number[room]],
        };
        socket.to(room).emit("get-number", number[room]);
      });

      socket.on("set-remaining-rewards", ({ resultMessage, roomCode }) => {
        rewards = rewards.filter((r) => r !== resultMessage);
        socket.to(roomCode).emit("get-remaining-rewards", rewards);
      });

      socket.on(
        "update-users-with-new-result",
        ({ resultMessage, roomCode }) => {
          const updatedUser = {
            ...users[socket.id],
            resultMessage,
            room: roomCode,
          };
          socket.to(roomCode).emit("set-users-with-new-result", updatedUser);
        }
      );

      socket.on("disconnect", () => {
        socket.to(chatRoom).emit("user-disconnected", users[socket.id]);
        delete users[socket.id];
      });
    });
  }
  res.end();
};

export default SocketHandler;
