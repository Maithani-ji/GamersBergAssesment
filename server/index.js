import http from "http";
import dotenv from "dotenv";
import app from "./app.js";
import { setupGracefulShutdown } from "./src/config/shutdown.js";
import { initSocket } from "./src/config/socket.js";

dotenv.config();

const PORT = process.env.PORT || 3001;

const server = http.createServer(app);

await initSocket(server);

server.listen(PORT,"0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Catch uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error(`[UNCAUGHT EXCEPTION]: ${err.message}`);
  process.exit(1);
});

// Catch unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`[UNHANDLED REJECTION]: ${err.message}`);
});

setupGracefulShutdown(server);
