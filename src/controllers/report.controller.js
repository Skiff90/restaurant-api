const ReportService = require("../services/report.service");
const logger = require("../config/logger.config");

const reportController =
  {
    async generateSalesReport(
      req,
      res,
    ) {
      try {
        const {
          startDate,
          endDate,
        } =
          req.query;
        const reportService =
          new ReportService();

        const filePath =
          await reportService.generateSalesReport(
            new Date(
              startDate,
            ),
            new Date(
              endDate,
            ),
          );

        res.download(
          filePath,
        );
      } catch (error) {
        logger.error(
          "Error in generateSalesReport:",
          error,
        );
        res
          .status(
            500,
          )
          .json({
            message:
              "Помилка генерації звіту",
          });
      }
    },

    async generatePopularityReport(
      req,
      res,
    ) {
      try {
        const reportService =
          new ReportService();
        const filePath =
          await reportService.generatePopularityReport();

        res.download(
          filePath,
        );
      } catch (error) {
        logger.error(
          "Error in generatePopularityReport:",
          error,
        );
        res
          .status(
            500,
          )
          .json({
            message:
              "Помилка генерації звіту",
          });
      }
    },
  };

module.exports =
  reportController;
