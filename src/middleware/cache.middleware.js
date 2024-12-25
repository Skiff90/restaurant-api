const redis = require("../config/redis.config");
const logger = require("../config/logger.config");

const cacheMiddleware =
  (duration) => {
    return async (
      req,
      res,
      next,
    ) => {
      try {
        const key = `cache:${req.originalUrl}`;
        const cachedData =
          await redis.get(
            key,
          );

        if (
          cachedData
        ) {
          logger.info(
            `Cache hit for ${key}`,
          );
          return res.json(
            JSON.parse(
              cachedData,
            ),
          );
        }

        // Модифікуємо res.json для збереження відповіді в кеші
        const originalJson =
          res.json;
        res.json =
          function (
            data,
          ) {
            redis.setex(
              key,
              duration,
              JSON.stringify(
                data,
              ),
            );
            return originalJson.call(
              this,
              data,
            );
          };

        next();
      } catch (error) {
        logger.error(
          "Cache middleware error:",
          error,
        );
        next();
      }
    };
  };

module.exports =
  cacheMiddleware;
