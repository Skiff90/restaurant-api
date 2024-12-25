const {
  Order,
  OrderDish,
  Dish,
  User,
} = require("../models");
const sequelize = require("../config/db.config");
const logger = require("../config/logger.config");
const emailService = require("../services/email.service");
const paymentService = require("../services/payment.service");
const discountService = require("../services/discount.service");

const orderController =
  {
    // Створити нове замовлення
    async createOrder(
      req,
      res,
    ) {
      const t =
        await sequelize.transaction();
      try {
        const {
          dishes,
        } =
          req.body;
        const userId =
          req.user
            .id;

        // Отримуємо інформацію про всі страви
        const dishIds =
          dishes.map(
            (d) =>
              d.dishId,
          );
        const dishesInfo =
          await Dish.findAll(
            {
              where:
                {
                  id: dishIds,
                },
            },
          );

        // Розраховуємо загальну суму
        let totalAmount = 0;
        dishes.forEach(
          (
            orderDish,
          ) => {
            const dish =
              dishesInfo.find(
                (
                  d,
                ) =>
                  d.id ===
                  orderDish.dishId,
              );
            totalAmount +=
              dish.price *
              orderDish.quantity;
          },
        );

        // Створюємо замовлення
        const order =
          await Order.create(
            {
              userId,
              totalAmount,
              status:
                "pending",
            },
            {
              transaction:
                t,
            },
          );

        // Додаємо страви до замовлення
        await Promise.all(
          dishes.map(
            (
              dish,
            ) => {
              return OrderDish.create(
                {
                  orderId:
                    order.id,
                  dishId:
                    dish.dishId,
                  quantity:
                    dish.quantity,
                },
                {
                  transaction:
                    t,
                },
              );
            },
          ),
        );

        const user =
          await User.findByPk(
            userId,
          );
        await emailService.sendOrderConfirmation(
          order,
          user,
        );

        logger.info(
          `Нове замовлення створено: ${order.id}`,
        );
        await t.commit();
        res
          .status(
            201,
          )
          .json(
            order,
          );
      } catch (error) {
        await t.rollback();
        logger.error(
          "Помилка створення замовлення:",
          error,
        );
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

    // Отримати замовлення користувача
    async getUserOrders(
      req,
      res,
    ) {
      try {
        const orders =
          await Order.findAll(
            {
              where:
                {
                  userId:
                    req
                      .user
                      .id,
                },
              include:
                [
                  {
                    model:
                      Dish,
                    through:
                      {
                        attributes:
                          [
                            "quantity",
                          ],
                      },
                  },
                ],
            },
          );
        res.json(
          orders,
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

    // Оновити статус замовлення (для персоналу)
    async updateOrderStatus(
      req,
      res,
    ) {
      try {
        const {
          id,
        } =
          req.params;
        const {
          status,
        } =
          req.body;

        const order =
          await Order.findByPk(
            id,
          );
        if (
          !order
        ) {
          logger.warn(
            `Спроба оновити неіснуюче замовлення: ${id}`,
          );
          return res
            .status(
              404,
            )
            .json({
              message:
                "Замовлення не знайдено",
            });
        }

        order.status =
          status;
        await order.save();

        const user =
          await User.findByPk(
            order.userId,
          );
        await emailService.sendStatusUpdate(
          order,
          user,
        );

        logger.info(
          `Статус замовлення ${id} оновлено на ${status}`,
        );
        res.json(
          order,
        );
      } catch (error) {
        logger.error(
          "Помилка оновлення статусу замовлення:",
          error,
        );
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

    async createOrderWithPayment(
      req,
      res,
    ) {
      const t =
        await sequelize.transaction();
      try {
        const {
          dishes,
          discountCode,
        } =
          req.body;
        const userId =
          req.user
            .id;

        // Розрахунок суми замовлення
        let totalAmount =
          await calculateOrderAmount(
            dishes,
          );

        // Перевірка та застосування знижки
        if (
          discountCode
        ) {
          const {
            valid,
            discount,
            message,
          } =
            await discountService.validateDiscount(
              discountCode,
              totalAmount,
            );

          if (
            !valid
          ) {
            return res
              .status(
                400,
              )
              .json(
                {
                  message,
                },
              );
          }

          const discountAmount =
            discountService.calculateDiscountAmount(
              totalAmount,
              discount,
            );
          totalAmount -=
            discountAmount;
        }

        // Створення платіжного наміру
        const paymentIntent =
          await paymentService.createPaymentIntent(
            totalAmount,
          );

        // Створення замовлення
        const order =
          await Order.create(
            {
              userId,
              totalAmount,
              status:
                "pending",
              paymentIntentId:
                paymentIntent.id,
            },
            {
              transaction:
                t,
            },
          );

        // ... додавання страв до замовлення ...

        await t.commit();
        res
          .status(
            201,
          )
          .json({
            order,
            clientSecret:
              paymentIntent.client_secret,
          });
      } catch (error) {
        await t.rollback();
        logger.error(
          "Помилка створення замовлення з оплатою:",
          error,
        );
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

    async handlePaymentWebhook(
      req,
      res,
    ) {
      const sig =
        req.headers[
          "stripe-signature"
        ];
      try {
        const event =
          stripe.webhooks.constructEvent(
            req.body,
            sig,
            process
              .env
              .STRIPE_WEBHOOK_SECRET,
          );

        if (
          event.type ===
          "payment_intent.succeeded"
        ) {
          const paymentIntent =
            event
              .data
              .object;
          await Order.update(
            {
              status:
                "paid",
            },
            {
              where:
                {
                  paymentIntentId:
                    paymentIntent.id,
                },
            },
          );
          logger.info(
            `Платіж успішний для замовлення з PaymentIntent: ${paymentIntent.id}`,
          );
        }

        res.json({
          received: true,
        });
      } catch (error) {
        logger.error(
          "Помилка обробки webhook:",
          error,
        );
        res
          .status(
            400,
          )
          .send(
            `Webhook Error: ${error.message}`,
          );
      }
    },
  };

module.exports =
  orderController;
