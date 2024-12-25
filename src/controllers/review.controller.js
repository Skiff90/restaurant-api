const {
  Review,
  User,
  Dish,
} = require("../models");
const logger = require("../config/logger.config");
const redis = require("../config/redis.config");

const reviewController =
  {
    async createReview(
      req,
      res,
    ) {
      try {
        const {
          dishId,
          rating,
          comment,
        } =
          req.body;
        const userId =
          req.user
            .id;

        // Перевірка чи замовляв користувач цю страву
        const hasOrdered =
          await Order.findOne(
            {
              where:
                {
                  userId,
                },
              include:
                [
                  {
                    model:
                      Dish,
                    where:
                      {
                        id: dishId,
                      },
                  },
                ],
            },
          );

        if (
          !hasOrdered
        ) {
          return res
            .status(
              403,
            )
            .json({
              message:
                "Ви можете залишити відгук тільки після замовлення страви",
            });
        }

        const review =
          await Review.create(
            {
              userId,
              dishId,
              rating,
              comment,
            },
          );

        // Очищення кешу рейтингу страви
        await redis.del(
          `dish:${dishId}:rating`,
        );

        res
          .status(
            201,
          )
          .json(
            review,
          );
      } catch (error) {
        logger.error(
          "Error creating review:",
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

    async getDishReviews(
      req,
      res,
    ) {
      try {
        const {
          dishId,
        } =
          req.params;
        const page =
          parseInt(
            req
              .query
              .page,
          ) || 1;
        const limit =
          parseInt(
            req
              .query
              .limit,
          ) || 10;

        const reviews =
          await Review.findAndCountAll(
            {
              where:
                {
                  dishId,
                },
              include:
                [
                  {
                    model:
                      User,
                    attributes:
                      [
                        "name",
                      ],
                  },
                ],
              order:
                [
                  [
                    "createdAt",
                    "DESC",
                  ],
                ],
              limit,
              offset:
                (page -
                  1) *
                limit,
            },
          );

        res.json({
          reviews:
            reviews.rows,
          total:
            reviews.count,
          pages:
            Math.ceil(
              reviews.count /
                limit,
            ),
        });
      } catch (error) {
        logger.error(
          "Error getting dish reviews:",
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
  reviewController;
