const WebSocket = require("ws");
const logger = require("./logger.config");

class WebSocketServer {
  constructor(
    server,
  ) {
    this.wss =
      new WebSocket.Server(
        { server },
      );
    this.clients =
      new Map();

    this.wss.on(
      "connection",
      (ws, req) => {
        const userId =
          req.url.split(
            "=",
          )[1]; // отримуємо userId з URL

        if (
          userId
        ) {
          this.clients.set(
            userId,
            ws,
          );
          logger.info(
            `Client connected: ${userId}`,
          );
        }

        ws.on(
          "close",
          () => {
            this.clients.delete(
              userId,
            );
            logger.info(
              `Client disconnected: ${userId}`,
            );
          },
        );
      },
    );
  }

  sendToUser(
    userId,
    message,
  ) {
    const client =
      this.clients.get(
        userId,
      );
    if (
      client &&
      client.readyState ===
        WebSocket.OPEN
    ) {
      client.send(
        JSON.stringify(
          message,
        ),
      );
    }
  }

  broadcastToStaff(
    message,
  ) {
    this.clients.forEach(
      (
        client,
        userId,
      ) => {
        if (
          client.readyState ===
          WebSocket.OPEN
        ) {
          client.send(
            JSON.stringify(
              message,
            ),
          );
        }
      },
    );
  }
}

module.exports =
  WebSocketServer;
