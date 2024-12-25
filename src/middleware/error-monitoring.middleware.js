const errorNotificationService = require("../services/error-notification.service");

const errorMonitoring =
  async (
    err,
    req,
    res,
    next,
  ) => {
    // Контекст помилки
    const errorContext =
      {
        path: req.path,
        method:
          req.method,
        body: req.body,
        params:
          req.params,
        query:
          req.query,
        user: req.user
          ? req.user
              .id
          : "anonymous",
        timestamp:
          new Date().toISOString(),
      };

    // Відправка сповіщення про помилку
    await errorNotificationService.notifyError(
      err,
      errorContext,
    );

    // Відправка відповіді клієнту
    res
      .status(500)
      .json({
        message:
          process
            .env
            .NODE_ENV ===
          "production"
            ? "Внутрішня помилка сервера"
            : err.message,
      });
  };

module.exports =
  errorMonitoring;
