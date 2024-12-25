const {
  performance,
  PerformanceObserver,
} = require("perf_hooks");
const logger = require("../src/config/logger.config");

class PerformanceMonitor {
  constructor() {
    this.observer =
      new PerformanceObserver(
        (list) => {
          const entries =
            list.getEntries();
          entries.forEach(
            (
              entry,
            ) => {
              logger.info(
                "Performance metric:",
                {
                  name: entry.name,
                  duration:
                    entry.duration,
                  timestamp:
                    entry.timestamp,
                },
              );

              // Сповіщення про повільні операції
              if (
                entry.duration >
                1000
              ) {
                logger.warn(
                  "Slow operation detected:",
                  {
                    name: entry.name,
                    duration:
                      entry.duration,
                  },
                );
              }
            },
          );
        },
      );

    this.observer.observe(
      {
        entryTypes:
          [
            "measure",
          ],
        buffered: true,
      },
    );
  }

  startMeasure(
    name,
  ) {
    performance.mark(
      `${name}-start`,
    );
  }

  endMeasure(name) {
    performance.mark(
      `${name}-end`,
    );
    performance.measure(
      name,
      `${name}-start`,
      `${name}-end`,
    );
  }

  async measureAsync(
    name,
    callback,
  ) {
    this.startMeasure(
      name,
    );
    try {
      const result =
        await callback();
      return result;
    } finally {
      this.endMeasure(
        name,
      );
    }
  }
}

module.exports =
  new PerformanceMonitor();
