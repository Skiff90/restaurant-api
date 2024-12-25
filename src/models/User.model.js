// server/models/User.js
const {
  DataTypes,
} = require("sequelize");
const sequelize = require("../config/db.config");
const bcrypt = require("bcrypt");

const User =
  sequelize.define(
    "User",
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
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM(
          "admin",
          "user",
          "staff",
        ),
        defaultValue:
          "user",
      },
    },
    {
      hooks: {
        beforeCreate:
          async (
            user,
          ) => {
            user.password =
              await bcrypt.hash(
                user.password,
                10,
              );
          },
      },
    },
  );

module.exports =
  User;
