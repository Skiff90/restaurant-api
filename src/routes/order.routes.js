const express = require("express");
const router =
  express.Router();
const orderController = require("../controllers/order.controller");
const authMiddleware = require("../middleware/auth.middleware");
const validator = require("../middleware/validator.middleware");
const {
  order:
    orderSchema,
  orderWithPaymentSchema,
} = require("../validators/schemas");

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dishes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     dishId:
 *                       type: string
 *                       format: uuid
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  authMiddleware,
  validator(
    orderSchema,
  ),
  orderController.createOrder,
);

router.get(
  "/my-orders",
  authMiddleware,
  orderController.getUserOrders,
);

router.patch(
  "/:id/status",
  authMiddleware,
  orderController.updateOrderStatus,
);

router.post(
  "/with-payment",
  authMiddleware,
  validator(
    orderWithPaymentSchema,
  ),
  orderController.createOrderWithPayment,
);

router.post(
  "/webhook",
  express.raw({
    type: "application/json",
  }),
  orderController.handlePaymentWebhook,
);

module.exports =
  router;
