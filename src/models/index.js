const User = require("./User.model");
const Dish = require("./Dish.model");
const Order = require("./Order.model");
const Review = require("./Review.model");
const sequelize = require("../config/db.config");

// Встановлюємо зв'язки
User.hasMany(Order);
Order.belongsTo(
  User,
);

// Створюємо проміжну таблицю для зв'язку замовлень і страв
const OrderDish =
  sequelize.define(
    "OrderDish",
    {
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
    },
  );

Order.belongsToMany(
  Dish,
  {
    through:
      OrderDish,
  },
);
Dish.belongsToMany(
  Order,
  {
    through:
      OrderDish,
  },
);

module.exports = {
  User,
  Dish,
  Order,
  OrderDish,
};
