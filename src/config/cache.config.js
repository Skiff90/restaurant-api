const redis = require("./redis.config");
const logger = require("./logger.config");

class CacheManager {
  constructor() {
    this.defaultTTL = 3600; // 1 година
  }

  async get(key) {
    try {
      const data =
        await redis.get(
          key,
        );
      return data
        ? JSON.parse(
            data,
          )
        : null;
    } catch (error) {
      logger.error(
        `Cache get error for key ${key}:`,
        error,
      );
      return null;
    }
  }

  async set(
    key,
    value,
    ttl = this
      .defaultTTL,
  ) {
    try {
      await redis.setex(
        key,
        ttl,
        JSON.stringify(
          value,
        ),
      );
    } catch (error) {
      logger.error(
        `Cache set error for key ${key}:`,
        error,
      );
    }
  }

  async invalidate(
    pattern,
  ) {
    try {
      const keys =
        await redis.keys(
          pattern,
        );
      if (
        keys.length >
        0
      ) {
        await redis.del(
          keys,
        );
        logger.info(
          `Invalidated cache for pattern: ${pattern}`,
        );
      }
    } catch (error) {
      logger.error(
        `Cache invalidation error for pattern ${pattern}:`,
        error,
      );
    }
  }

  getCacheKey(
    ...args
  ) {
    return args.join(
      ":",
    );
  }
}

module.exports =
  new CacheManager();
