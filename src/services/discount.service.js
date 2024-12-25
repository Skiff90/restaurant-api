const {
  Discount,
} = require("../models");
const logger = require("../config/logger.config");

const discountService =
  {
    async validateDiscount(
      code,
      orderAmount,
    ) {
      try {
        const discount =
          await Discount.findOne(
            {
              where:
                {
                  code,
                  isActive: true,
                },
            },
          );

        if (
          !discount
        ) {
          return {
            valid: false,
            message:
              "Знижка не знайдена",
          };
        }

        const now =
          new Date();
        if (
          now <
            discount.startDate ||
          now >
            discount.endDate
        ) {
          return {
            valid: false,
            message:
              "Знижка не активна",
          };
        }

        if (
          discount.usageLimit &&
          discount.usageCount >=
            discount.usageLimit
        ) {
          return {
            valid: false,
            message:
              "Ліміт використання знижки вичерпано",
          };
        }

        if (
          orderAmount <
          discount.minimumOrderAmount
        ) {
          return {
            valid: false,
            message: `Мінімальна сума замовлення: ${discount.minimumOrderAmount} грн`,
          };
        }

        return {
          valid: true,
          discount:
            discount,
        };
      } catch (error) {
        logger.error(
          "Помилка валідації знижки:",
          error,
        );
        throw error;
      }
    },

    calculateDiscountAmount(
      orderAmount,
      discount,
    ) {
      if (
        discount.type ===
        "percentage"
      ) {
        return (
          (orderAmount *
            discount.value) /
          100
        );
      }
      return discount.value;
    },
  };

module.exports =
  discountService;
