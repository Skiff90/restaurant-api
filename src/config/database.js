const {
  Sequelize,
} = require("sequelize");
require("dotenv").config();

const sequelize =
  new Sequelize({
    host: process.env.DB_HOST,
    dialect: "postgres",
    username:
      process.env.DB_USER,
    password:
      process.env.DB_PASSWORD,
    database:
      process.env.DB_NAME,
    port: process.env.DB_PORT,
    logging: false,
  });

module.exports = sequelize;
