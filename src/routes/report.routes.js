const express = require("express");
const router =
  express.Router();
const reportController = require("../controllers/report.controller");
const authMiddleware = require("../middleware/auth.middleware");
const isAdmin = require("../middleware/admin.middleware");

router.use(
  authMiddleware,
  isAdmin,
);

router.get(
  "/sales",
  reportController.generateSalesReport,
);
router.get(
  "/popularity",
  reportController.generatePopularityReport,
);

module.exports =
  router;
