export function registerSocketHandlers(io) {
    const messageHistory = [];
  
    io.on("connection", (socket) => {
      console.log(`User connected: ${socket.id}`);
  
      // Send last 20 messages to the new user
      socket.emit("message_history", messageHistory);
  
      socket.on("send_message", (msg) => {
        const message = {
          id: Date.now(),
          text: msg.text?.trim(),
          username: msg.username?.trim(),
          timestamp: new Date().toISOString(),
        };
  
        if (!message.text || !message.username) return;
  
        messageHistory.unshift(message);
        if (messageHistory.length > 20) {
          messageHistory.pop();
        }
  
        io.emit("receive_message", message);
      });
  
      socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
      });
    });
  }
  