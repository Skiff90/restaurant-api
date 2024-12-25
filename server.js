// server/server.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./src/config/swagger.config");
const monitoring = require("./src/services/monitoring.service");
const errorMonitoring = require("./src/middleware/error-monitoring.middleware");

const app =
  express();
const port =
  process.env
    .PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(
  express.json(),
);

const userRoutes = require("./src/routes/user.routes");
const dishRoutes = require("./src/routes/dish.routes");
const orderRoutes = require("./src/routes/order.routes");

// Маршрути
app.use(
  "/api/users",
  userRoutes,
);
app.use(
  "/api/dishes",
  dishRoutes,
);
app.use(
  "/api/orders",
  orderRoutes,
);

// Swagger документація
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(
    swaggerSpecs,
  ),
);

// Моніторинг
app.use(
  monitoring.requestDurationMiddleware(),
);

// Метрики Prometheus
app.get(
  "/metrics",
  async (
    req,
    res,
  ) => {
    try {
      res.set(
        "Content-Type",
        monitoring
          .register
          .contentType,
      );
      res.end(
        await monitoring.getMetrics(),
      );
    } catch (error) {
      res
        .status(500)
        .end(error);
    }
  },
);

// Обробка помилок з моніторингом
app.use(
  errorMonitoring,
);

app.listen(
  port,
  () => {
    console.log(
      `Server running on http://localhost:${port}`,
    );
  },
);
