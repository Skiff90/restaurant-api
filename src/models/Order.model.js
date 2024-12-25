const {
  DataTypes,
} = require("sequelize");
const sequelize = require("../config/db.config");

const Order =
  sequelize.define(
    "Order",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue:
          DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(
          "pending",
          "processing",
          "completed",
          "cancelled",
        ),
        defaultValue:
          "pending",
      },
      totalAmount: {
        type: DataTypes.DECIMAL(
          10,
          2,
        ),
        allowNull: false,
      },
      orderDate: {
        type: DataTypes.DATE,
        defaultValue:
          DataTypes.NOW,
      },
    },
  );

module.exports =
  Order;
