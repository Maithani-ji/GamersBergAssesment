
import { io } from "socket.io-client";

import { HOST, PORT } from '@env';


const socket = io(`http://${HOST}:${PORT}`, {
  transports: ["websocket"],
  autoConnect: false,
});

export default socket;
