const express = require("express");
const router =
  express.Router();
const reviewController = require("../controllers/review.controller");
const authMiddleware = require("../middleware/auth.middleware");
const validator = require("../middleware/validator.middleware");
const {
  reviewSchema,
} = require("../validators/schemas");

router.post(
  "/",
  authMiddleware,
  validator(
    reviewSchema,
  ),
  reviewController.createReview,
);

router.get(
  "/dish/:dishId",
  reviewController.getDishReviews,
);

module.exports =
  router;
