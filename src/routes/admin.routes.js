const express = require("express");
const router =
  express.Router();
const adminController = require("../controllers/admin.controller");
const authMiddleware = require("../middleware/auth.middleware");
const isAdmin = require("../middleware/admin.middleware");
const cacheMiddleware = require("../middleware/cache.middleware");

// Захищені адмін-маршрути
router.use(
  authMiddleware,
  isAdmin,
);

// Статистика
router.get(
  "/dashboard",
  cacheMiddleware(
    300,
  ),
  adminController.getDashboardStats,
);

// Управління користувачами
router.get(
  "/users",
  adminController.getUsers,
);
router.patch(
  "/users/:id/role",
  adminController.updateUserRole,
);

// Управління знижками
router.post(
  "/discounts",
  adminController.createDiscount,
);

module.exports =
  router;
