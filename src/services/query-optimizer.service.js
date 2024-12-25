const {
  sequelize,
} = require("../models");
const logger = require("../config/logger.config");

class QueryOptimizer {
  async analyzeQuery(
    sql,
    params,
  ) {
    try {
      const explain =
        await sequelize.query(
          `EXPLAIN ANALYZE ${sql}`,
          {
            replacements:
              params,
            type: sequelize
              .QueryTypes
              .SELECT,
          },
        );

      logger.info(
        "Query analysis:",
        {
          sql,
          explain,
        },
      );
      return explain;
    } catch (error) {
      logger.error(
        "Query analysis error:",
        error,
      );
      throw error;
    }
  }

  getOptimizedInclude(
    includes,
  ) {
    return includes.map(
      (
        include,
      ) => ({
        ...include,
        separate: true, // Окремі запити для зменшення навантаження
        limit:
          include.limit ||
          10, // Обмеження кількості записів
      }),
    );
  }

  getPaginationOptions(
    page,
    limit,
  ) {
    page =
      parseInt(
        page,
      ) || 1;
    limit =
      parseInt(
        limit,
      ) || 10;

    return {
      offset:
        (page - 1) *
        limit,
      limit,
      distinct: true, // Для правильного підрахунку з включеними зв'язками
    };
  }
}

module.exports =
  new QueryOptimizer();
