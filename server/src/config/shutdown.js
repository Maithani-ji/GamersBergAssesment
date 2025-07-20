export function setupGracefulShutdown(server) {
    process.on("SIGTERM", () => {
      server.close(() => {
        console.log("Server closed gracefully (SIGTERM)");
        process.exit(0);
      });
    });
  
    process.on("SIGINT", () => {
      server.close(() => {
        console.log("Server closed gracefully (SIGINT)");
        process.exit(0);
      });
    });
  }
  