const prometheus = require("prom-client");
const logger = require("../config/logger.config");

class MonitoringService {
  constructor() {
    this.register =
      new prometheus.Registry();

    // Метрики для HTTP запитів
    this.httpRequestDuration =
      new prometheus.Histogram(
        {
          name: "http_request_duration_seconds",
          help: "Duration of HTTP requests in seconds",
          labelNames:
            [
              "method",
              "route",
              "status_code",
            ],
          buckets: [
            0.1,
            0.5, 1,
            2, 5,
          ],
        },
      );

    // Метрики для активних користувачів
    this.activeUsers =
      new prometheus.Gauge(
        {
          name: "active_users",
          help: "Number of active users",
        },
      );

    // Метрики для замовлень
    this.orderCounter =
      new prometheus.Counter(
        {
          name: "orders_total",
          help: "Total number of orders",
        },
      );

    // Реєстрація метрик
    this.register.registerMetric(
      this
        .httpRequestDuration,
    );
    this.register.registerMetric(
      this
        .activeUsers,
    );
    this.register.registerMetric(
      this
        .orderCounter,
    );
  }

  // Middleware для моніторингу HTTP запитів
  requestDurationMiddleware() {
    return (
      req,
      res,
      next,
    ) => {
      const start =
        Date.now();
      res.on(
        "finish",
        () => {
          const duration =
            (Date.now() -
              start) /
            1000;
          this.httpRequestDuration.observe(
            {
              method:
                req.method,
              route:
                req
                  .route
                  ?.path ||
                req.path,
              status_code:
                res.statusCode,
            },
            duration,
          );
        },
      );
      next();
    };
  }

  // Методи для оновлення метрик
  incrementOrders() {
    this.orderCounter.inc();
  }

  updateActiveUsers(
    count,
  ) {
    this.activeUsers.set(
      count,
    );
  }

  // Метод для отримання метрик
  async getMetrics() {
    return await this.register.metrics();
  }
}

module.exports =
  new MonitoringService();
