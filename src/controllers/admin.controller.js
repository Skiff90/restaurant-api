const {
  User,
  Order,
  Dish,
  Discount,
} = require("../models");
const logger = require("../config/logger.config");
const redis = require("../config/redis.config");

const adminController =
  {
    // Статистика
    async getDashboardStats(
      req,
      res,
    ) {
      try {
        const cacheKey =
          "admin:dashboard";
        const cachedStats =
          await redis.get(
            cacheKey,
          );

        if (
          cachedStats
        ) {
          return res.json(
            JSON.parse(
              cachedStats,
            ),
          );
        }

        const stats =
          {
            totalOrders:
              await Order.count(),
            totalRevenue:
              await Order.sum(
                "totalAmount",
                {
                  where:
                    {
                      status:
                        "completed",
                    },
                },
              ),
            totalUsers:
              await User.count(),
            popularDishes:
              await Order.findAll(
                {
                  include:
                    [
                      {
                        model:
                          Dish,
                        attributes:
                          [
                            "name",
                          ],
                        through:
                          {
                            attributes:
                              [
                                "quantity",
                              ],
                          },
                      },
                    ],
                  limit: 5,
                  order:
                    [
                      [
                        Dish,
                        OrderDish,
                        "quantity",
                        "DESC",
                      ],
                    ],
                },
              ),
          };

        await redis.setex(
          cacheKey,
          3600,
          JSON.stringify(
            stats,
          ),
        );
        res.json(
          stats,
        );
      } catch (error) {
        logger.error(
          "Error getting dashboard stats:",
          error,
        );
        res
          .status(
            500,
          )
          .json({
            message:
              "Помилка сервера",
          });
      }
    },

    // Управління користувачами
    async getUsers(
      req,
      res,
    ) {
      try {
        const users =
          await User.findAll(
            {
              attributes:
                [
                  "id",
                  "name",
                  "email",
                  "role",
                  "createdAt",
                ],
            },
          );
        res.json(
          users,
        );
      } catch (error) {
        logger.error(
          "Error getting users:",
          error,
        );
        res
          .status(
            500,
          )
          .json({
            message:
              "Помилка сервера",
          });
      }
    },

    async updateUserRole(
      req,
      res,
    ) {
      try {
        const {
          userId,
          role,
        } =
          req.body;
        const user =
          await User.findByPk(
            userId,
          );

        if (!user) {
          return res
            .status(
              404,
            )
            .json({
              message:
                "Користувача не знайдено",
            });
        }

        user.role =
          role;
        await user.save();

        logger.info(
          `Updated role for user ${userId} to ${role}`,
        );
        res.json(
          user,
        );
      } catch (error) {
        logger.error(
          "Error updating user role:",
          error,
        );
        res
          .status(
            500,
          )
          .json({
            message:
              "Помилка сервера",
          });
      }
    },

    // Управління знижками
    async createDiscount(
      req,
      res,
    ) {
      try {
        const discount =
          await Discount.create(
            req.body,
          );
        logger.info(
          `Created new discount: ${discount.code}`,
        );
        res
          .status(
            201,
          )
          .json(
            discount,
          );
      } catch (error) {
        logger.error(
          "Error creating discount:",
          error,
        );
        res
          .status(
            500,
          )
          .json({
            message:
              "Помилка сервера",
          });
      }
    },
  };

module.exports =
  adminController;
