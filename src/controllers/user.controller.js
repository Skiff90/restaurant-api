const {
  User,
} = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userController =
  {
    // Реєстрація
    async register(
      req,
      res,
    ) {
      try {
        const {
          name,
          email,
          password,
        } =
          req.body;

        const existingUser =
          await User.findOne(
            {
              where:
                {
                  email,
                },
            },
          );
        if (
          existingUser
        ) {
          return res
            .status(
              400,
            )
            .json({
              message:
                "Користувач вже існує",
            });
        }

        const user =
          await User.create(
            {
              name,
              email,
              password,
            },
          );

        const token =
          jwt.sign(
            {
              id: user.id,
              email:
                user.email,
              role: user.role,
            },
            process
              .env
              .JWT_SECRET,
            {
              expiresIn:
                "24h",
            },
          );

        res
          .status(
            201,
          )
          .json({
            token,
          });
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

    // Авторизація
    async login(
      req,
      res,
    ) {
      try {
        const {
          email,
          password,
        } =
          req.body;

        const user =
          await User.findOne(
            {
              where:
                {
                  email,
                },
            },
          );
        if (!user) {
          return res
            .status(
              400,
            )
            .json({
              message:
                "Користувача не знайдено",
            });
        }

        const isValidPassword =
          await bcrypt.compare(
            password,
            user.password,
          );
        if (
          !isValidPassword
        ) {
          return res
            .status(
              400,
            )
            .json({
              message:
                "Невірний пароль",
            });
        }

        const token =
          jwt.sign(
            {
              id: user.id,
              email:
                user.email,
              role: user.role,
            },
            process
              .env
              .JWT_SECRET,
            {
              expiresIn:
                "24h",
            },
          );

        res.json({
          token,
        });
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
  userController;
