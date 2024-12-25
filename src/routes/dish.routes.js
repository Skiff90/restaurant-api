const express = require("express");
const router =
  express.Router();
const dishController = require("../controllers/dish.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.get(
  "/",
  dishController.getAllDishes,
);
router.post(
  "/",
  authMiddleware,
  dishController.createDish,
);
router.put(
  "/:id",
  authMiddleware,
  dishController.updateDish,
);

module.exports =
  router;
