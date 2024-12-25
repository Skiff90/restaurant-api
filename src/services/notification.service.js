const logger = require("../config/logger.config");

class NotificationService {
  constructor(
    webSocketServer,
  ) {
    this.wss =
      webSocketServer;
  }

  async notifyOrderStatus(
    userId,
    orderId,
    status,
  ) {
    try {
      this.wss.sendToUser(
        userId,
        {
          type: "ORDER_STATUS",
          data: {
            orderId,
            status,
            timestamp:
              new Date(),
          },
        },
      );
    } catch (error) {
      logger.error(
        "Error sending notification:",
        error,
      );
    }
  }

  async notifyNewOrder(
    order,
  ) {
    try {
      this.wss.broadcastToStaff(
        {
          type: "NEW_ORDER",
          data: {
            orderId:
              order.id,
            totalAmount:
              order.totalAmount,
            timestamp:
              new Date(),
          },
        },
      );
    } catch (error) {
      logger.error(
        "Error broadcasting new order:",
        error,
      );
    }
  }
}

module.exports =
  NotificationService;
