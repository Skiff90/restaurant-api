const {
  DataTypes,
} = require("sequelize");
const sequelize = require("../config/db.config");

const Discount =
  sequelize.define(
    "Discount",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue:
          DataTypes.UUIDV4,
        primaryKey: true,
      },
      code: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM(
          "percentage",
          "fixed",
        ),
        allowNull: false,
      },
      value: {
        type: DataTypes.DECIMAL(
          10,
          2,
        ),
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      minimumOrderAmount:
        {
          type: DataTypes.DECIMAL(
            10,
            2,
          ),
          defaultValue: 0,
        },
      usageLimit: {
        type: DataTypes.INTEGER,
        defaultValue:
          null,
      },
      usageCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
  );

module.exports =
  Discount;
