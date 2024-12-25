const nodemailer = require("nodemailer");
const logger = require("../config/logger.config");

const transporter =
  nodemailer.createTransport(
    {
      host: process
        .env
        .SMTP_HOST,
      port: process
        .env
        .SMTP_PORT,
      secure: true,
      auth: {
        user: process
          .env
          .SMTP_USER,
        pass: process
          .env
          .SMTP_PASS,
      },
    },
  );

const emailService =
  {
    async sendOrderConfirmation(
      order,
      user,
    ) {
      try {
        await transporter.sendMail(
          {
            from: process
              .env
              .SMTP_USER,
            to: user.email,
            subject: `Замовлення №${order.id} підтверджено`,
            html: `
                    <h2>Дякуємо за ваше замовлення!</h2>
                    <p>Номер замовлення: ${order.id}</p>
                    <p>Сума замовлення: ${order.totalAmount} грн</p>
                    <p>Статус: ${order.status}</p>
                `,
          },
        );
        logger.info(
          `Email підтвердження відправлено для замовлення ${order.id}`,
        );
      } catch (error) {
        logger.error(
          "Помилка відправки email:",
          error,
        );
        throw error;
      }
    },

    async sendStatusUpdate(
      order,
      user,
    ) {
      try {
        await transporter.sendMail(
          {
            from: process
              .env
              .SMTP_USER,
            to: user.email,
            subject: `Оновлення статусу замовлення №${order.id}`,
            html: `
                    <h2>Статус вашого замовлення оновлено</h2>
                    <p>Номер замовлення: ${order.id}</p>
                    <p>Новий статус: ${order.status}</p>
                `,
          },
        );
        logger.info(
          `Email про оновлення статусу відправлено для замовлення ${order.id}`,
        );
      } catch (error) {
        logger.error(
          "Помилка відправки email:",
          error,
        );
        throw error;
      }
    },
  };

module.exports =
  emailService;
