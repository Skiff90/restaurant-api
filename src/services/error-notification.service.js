const nodemailer = require("nodemailer");
const Slack = require("@slack/webhook");
const logger = require("../config/logger.config");

class ErrorNotificationService {
  constructor() {
    this.emailTransporter =
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

    this.slackWebhook =
      new Slack.IncomingWebhook(
        process.env.SLACK_WEBHOOK_URL,
      );
  }

  async notifyError(
    error,
    context = {},
  ) {
    try {
      // Логування помилки
      logger.error(
        "Application error:",
        {
          error:
            error.message,
          stack:
            error.stack,
          context,
        },
      );

      // Відправка email
      await this.sendEmailNotification(
        error,
        context,
      );

      // Відправка повідомлення в Slack
      await this.sendSlackNotification(
        error,
        context,
      );
    } catch (notificationError) {
      logger.error(
        "Error sending notification:",
        notificationError,
      );
    }
  }

  async sendEmailNotification(
    error,
    context,
  ) {
    const emailContent = `
            <h2>Error Report</h2>
            <p><strong>Error:</strong> ${
              error.message
            }</p>
            <p><strong>Stack:</strong> ${
              error.stack
            }</p>
            <p><strong>Context:</strong> ${JSON.stringify(
              context,
              null,
              2,
            )}</p>
            <p><strong>Time:</strong> ${new Date().toISOString()}</p>
        `;

    await this.emailTransporter.sendMail(
      {
        from: process
          .env
          .SMTP_USER,
        to: process
          .env
          .ERROR_NOTIFICATION_EMAIL,
        subject: `[ERROR] Restaurant API Error`,
        html: emailContent,
      },
    );
  }

  async sendSlackNotification(
    error,
    context,
  ) {
    const slackMessage =
      {
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: "🚨 Error Alert",
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*Error:* ${error.message}\n*Stack:* ${error.stack}`,
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*Context:*\n\`\`\`${JSON.stringify(
                context,
                null,
                2,
              )}\`\`\``,
            },
          },
        ],
      };

    await this.slackWebhook.send(
      slackMessage,
    );
  }
}

module.exports =
  new ErrorNotificationService();
