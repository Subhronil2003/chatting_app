const http = require("http");
const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin: "http://127.0.0.1:5500",
  })
);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const users = {};

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("new-user-joined", (name1) => {
    users[socket.id] = name1;
    console.log(`New user: ${name1}`);
    socket.broadcast.emit("user-joined", name1);
  });

  socket.on("send-message", (data) => {
    console.log(`Message from ${data.name1}: ${data.message}`);
    socket.broadcast.emit("receive-message", data);
  });

  socket.on("disconnect", () => {
    const name1 = users[socket.id];
    if (name1) {
      console.log(`${name1} disconnected`);
      socket.broadcast.emit("user-left", name1);
      delete users[socket.id];
    }
  });
});

server.listen(8000, () => {
  console.log("Server is running on http://localhost:8000");
});
