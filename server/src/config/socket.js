import { Server } from "socket.io";
import { registerSocketHandlers } from "../controller/socketControllers.js";


export async function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  registerSocketHandlers(io);

  console.log("Socket.IO initialized");
}
