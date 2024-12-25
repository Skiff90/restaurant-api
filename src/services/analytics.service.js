const {
  Order,
  Dish,
  User,
  Review,
} = require("../models");
const {
  Op,
} = require("sequelize");
const sequelize = require("../config/db.config");
const redis = require("../config/redis.config");

const analyticsService =
  {
    async getDailyRevenue(
      startDate,
      endDate,
    ) {
      const cacheKey = `analytics:daily:${startDate}:${endDate}`;
      const cached =
        await redis.get(
          cacheKey,
        );

      if (cached) {
        return JSON.parse(
          cached,
        );
      }

      const revenue =
        await Order.findAll(
          {
            attributes:
              [
                [
                  sequelize.fn(
                    "date_trunc",
                    "day",
                    sequelize.col(
                      "createdAt",
                    ),
                  ),
                  "date",
                ],
                [
                  sequelize.fn(
                    "sum",
                    sequelize.col(
                      "totalAmount",
                    ),
                  ),
                  "total",
                ],
              ],
            where: {
              createdAt:
                {
                  [Op.between]:
                    [
                      startDate,
                      endDate,
                    ],
                },
              status:
                "completed",
            },
            group: [
              sequelize.fn(
                "date_trunc",
                "day",
                sequelize.col(
                  "createdAt",
                ),
              ),
            ],
            order: [
              [
                sequelize.fn(
                  "date_trunc",
                  "day",
                  sequelize.col(
                    "createdAt",
                  ),
                ),
                "ASC",
              ],
            ],
          },
        );

      await redis.setex(
        cacheKey,
        3600,
        JSON.stringify(
          revenue,
        ),
      );
      return revenue;
    },

    async getPopularDishes() {
      return await Dish.findAll(
        {
          attributes:
            {
              include:
                [
                  [
                    sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM "OrderDish"
                            WHERE "OrderDish"."dishId" = "Dish"."id"
                        )`),
                    "orderCount",
                  ],
                  [
                    sequelize.literal(`(
                            SELECT AVG(rating)
                            FROM "Reviews"
                            WHERE "Reviews"."dishId" = "Dish"."id"
                        )`),
                    "averageRating",
                  ],
                ],
            },
          order: [
            [
              sequelize.literal(
                "orderCount",
              ),
              "DESC",
            ],
          ],
          limit: 10,
        },
      );
    },

    async getUserRetentionRate() {
      const totalUsers =
        await User.count();
      const returningUsers =
        await Order.findAll(
          {
            attributes:
              [
                "userId",
                [
                  sequelize.fn(
                    "COUNT",
                    sequelize.col(
                      "id",
                    ),
                  ),
                  "orderCount",
                ],
              ],
            group: [
              "userId",
            ],
            having:
              sequelize.literal(
                "COUNT(id) > 1",
              ),
          },
        );

      return {
        totalUsers,
        returningUsers:
          returningUsers.length,
        retentionRate:
          (returningUsers.length /
            totalUsers) *
          100,
      };
    },
  };

module.exports =
  analyticsService;
