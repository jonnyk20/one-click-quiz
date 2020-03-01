import socketIO from "socket.io";
import buildQuiz from "./buildQuiz";
import { Server } from "http";

const socket = (server: Server) => {
  const io = socketIO.listen(server);
  io.on("connection", socket => {
    console.log("a user is connected!");
    socket.emit("update", { hello: "world!" });
    socket.on("boom", msg => {
      console.log("msg from client", msg);
    });

    socket.on("submit-quiz", data => {
      buildQuiz(data, socket);
    });
  });
};

module.exports = socket;
