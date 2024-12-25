const {
  Dish,
} = require("../models");

const dishController =
  {
    // Отримати всі страви
    async getAllDishes(
      req,
      res,
    ) {
      try {
        const dishes =
          await Dish.findAll();
        res.json(
          dishes,
        );
      } catch (error) {
        res
          .status(
            500,
          )
          .json({
            message:
              "Помилка сервера",
            error:
              error.message,
          });
      }
    },

    // Створити нову страву
    async createDish(
      req,
      res,
    ) {
      try {
        const {
          name,
          description,
          price,
          category,
          imageUrl,
        } =
          req.body;
        const dish =
          await Dish.create(
            {
              name,
              description,
              price,
              category,
              imageUrl,
            },
          );
        res
          .status(
            201,
          )
          .json(
            dish,
          );
      } catch (error) {
        res
          .status(
            500,
          )
          .json({
            message:
              "Помилка сервера",
            error:
              error.message,
          });
      }
    },

    // Оновити страву
    async updateDish(
      req,
      res,
    ) {
      try {
        const {
          id,
        } =
          req.params;
        const updates =
          req.body;

        const dish =
          await Dish.findByPk(
            id,
          );
        if (!dish) {
          return res
            .status(
              404,
            )
            .json({
              message:
                "Страву не знайдено",
            });
        }

        await dish.update(
          updates,
        );
        res.json(
          dish,
        );
      } catch (error) {
        res
          .status(
            500,
          )
          .json({
            message:
              "Помилка сервера",
            error:
              error.message,
          });
      }
    },
  };

module.exports =
  dishController;
