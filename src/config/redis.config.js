const Redis = require("ioredis");
const logger = require("./logger.config");

const redis =
  new Redis({
    host: process
      .env
      .REDIS_HOST,
    port: process
      .env
      .REDIS_PORT,
    password:
      process.env
        .REDIS_PASSWORD,
  });

redis.on(
  "error",
  (error) => {
    logger.error(
      "Redis error:",
      error,
    );
  },
);

redis.on(
  "connect",
  () => {
    logger.info(
      "Redis connected successfully",
    );
  },
);

module.exports =
  redis;
