const {
  Order,
  User,
  Dish,
} = require("../models");
const ExcelJS = require("exceljs");
const path = require("path");
const logger = require("../config/logger.config");

class ReportService {
  async generateSalesReport(
    startDate,
    endDate,
  ) {
    try {
      const workbook =
        new ExcelJS.Workbook();
      const worksheet =
        workbook.addWorksheet(
          "Sales Report",
        );

      // Налаштування заголовків
      worksheet.columns =
        [
          {
            header:
              "Date",
            key: "date",
            width: 15,
          },
          {
            header:
              "Order ID",
            key: "orderId",
            width: 20,
          },
          {
            header:
              "Customer",
            key: "customer",
            width: 20,
          },
          {
            header:
              "Items",
            key: "items",
            width: 40,
          },
          {
            header:
              "Total Amount",
            key: "total",
            width: 15,
          },
        ];

      // Отримання даних
      const orders =
        await Order.findAll(
          {
            where: {
              createdAt:
                {
                  [Op.between]:
                    [
                      startDate,
                      endDate,
                    ],
                },
              status:
                "completed",
            },
            include:
              [
                {
                  model:
                    User,
                  attributes:
                    [
                      "name",
                    ],
                },
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

      // Додавання даних
      orders.forEach(
        (order) => {
          worksheet.addRow(
            {
              date: order.createdAt.toLocaleDateString(),
              orderId:
                order.id,
              customer:
                order
                  .User
                  .name,
              items:
                order.Dishes.map(
                  (
                    d,
                  ) =>
                    `${d.name} (${d.OrderDish.quantity})`,
                ).join(
                  ", ",
                ),
              total:
                order.totalAmount,
            },
          );
        },
      );

      // Збереження файлу
      const fileName = `sales-report-${
        startDate
          .toISOString()
          .split(
            "T",
          )[0]
      }.xlsx`;
      const filePath =
        path.join(
          __dirname,
          "../reports",
          fileName,
        );
      await workbook.xlsx.writeFile(
        filePath,
      );

      return filePath;
    } catch (error) {
      logger.error(
        "Error generating sales report:",
        error,
      );
      throw error;
    }
  }

  async generatePopularityReport() {
    try {
      const workbook =
        new ExcelJS.Workbook();
      const worksheet =
        workbook.addWorksheet(
          "Popularity Report",
        );

      worksheet.columns =
        [
          {
            header:
              "Dish Name",
            key: "name",
            width: 30,
          },
          {
            header:
              "Total Orders",
            key: "orders",
            width: 15,
          },
          {
            header:
              "Average Rating",
            key: "rating",
            width: 15,
          },
          {
            header:
              "Revenue",
            key: "revenue",
            width: 15,
          },
        ];

      const dishes =
        await Dish.findAll(
          {
            include:
              [
                {
                  model:
                    Order,
                  through:
                    {
                      attributes:
                        [
                          "quantity",
                        ],
                    },
                },
                {
                  model:
                    Review,
                  attributes:
                    [
                      "rating",
                    ],
                },
              ],
          },
        );

      dishes.forEach(
        (dish) => {
          worksheet.addRow(
            {
              name: dish.name,
              orders:
                dish.Orders.reduce(
                  (
                    sum,
                    o,
                  ) =>
                    sum +
                    o
                      .OrderDish
                      .quantity,
                  0,
                ),
              rating:
                dish.Reviews.reduce(
                  (
                    sum,
                    r,
                  ) =>
                    sum +
                    r.rating,
                  0,
                ) /
                  dish
                    .Reviews
                    .length ||
                0,
              revenue:
                dish.Orders.reduce(
                  (
                    sum,
                    o,
                  ) =>
                    sum +
                    o
                      .OrderDish
                      .quantity *
                      dish.price,
                  0,
                ),
            },
          );
        },
      );

      const fileName = `popularity-report-${
        new Date()
          .toISOString()
          .split(
            "T",
          )[0]
      }.xlsx`;
      const filePath =
        path.join(
          __dirname,
          "../reports",
          fileName,
        );
      await workbook.xlsx.writeFile(
        filePath,
      );

      return filePath;
    } catch (error) {
      logger.error(
        "Error generating popularity report:",
        error,
      );
      throw error;
    }
  }
}

module.exports =
  ReportService;
