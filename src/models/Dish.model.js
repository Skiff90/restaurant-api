const {
  DataTypes,
} = require("sequelize");
const sequelize = require("../config/db.config");

const Dish =
  sequelize.define(
    "Dish",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue:
          DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      price: {
        type: DataTypes.DECIMAL(
          10,
          2,
        ),
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      imageUrl: {
        type: DataTypes.STRING,
      },
      isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
  );

module.exports =
  Dish;
