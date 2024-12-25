// server/routes/userRoutes.js
const express = require("express");
const User = require("../src/models/User");
const router =
  express.Router();

// Отримати дані користувача
router.get(
  "/:id",
  async (
    req,
    res,
  ) => {
    try {
      const user =
        await User.findByPk(
          req.params
            .id,
        );
      if (!user)
        return res
          .status(
            404,
          )
          .json({
            error:
              "User not found",
          });
      res.json(
        user,
      );
    } catch (err) {
      res
        .status(500)
        .json({
          error:
            err.message,
        });
    }
  },
);

// Додати бонусні бали
router.put(
  "/:id/bonus",
  async (
    req,
    res,
  ) => {
    try {
      const {
        points,
      } = req.body;
      const user =
        await User.findByPk(
          req.params
            .id,
        );
      if (!user)
        return res
          .status(
            404,
          )
          .json({
            error:
              "User not found",
          });

      user.bonusPoints +=
        points;
      await user.save();
      res.json(
        user,
      );
    } catch (err) {
      res
        .status(500)
        .json({
          error:
            err.message,
        });
    }
  },
);

module.exports =
  router;
