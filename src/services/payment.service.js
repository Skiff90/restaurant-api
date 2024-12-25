const stripe =
  require("stripe")(
    process.env
      .STRIPE_SECRET_KEY,
  );
const logger = require("../config/logger.config");

const paymentService =
  {
    async createPaymentIntent(
      amount,
      currency = "uah",
    ) {
      try {
        const paymentIntent =
          await stripe.paymentIntents.create(
            {
              amount:
                Math.round(
                  amount *
                    100,
                ), // Конвертуємо в копійки
              currency,
              automatic_payment_methods:
                {
                  enabled: true,
                },
            },
          );

        logger.info(
          `Створено платіжний намір: ${paymentIntent.id}`,
        );
        return paymentIntent;
      } catch (error) {
        logger.error(
          "Помилка створення платежу:",
          error,
        );
        throw error;
      }
    },

    async confirmPayment(
      paymentIntentId,
    ) {
      try {
        const paymentIntent =
          await stripe.paymentIntents.confirm(
            paymentIntentId,
          );
        logger.info(
          `Підтверджено платіж: ${paymentIntentId}`,
        );
        return paymentIntent;
      } catch (error) {
        logger.error(
          "Помилка підтвердження платежу:",
          error,
        );
        throw error;
      }
    },
  };

module.exports =
  paymentService;
