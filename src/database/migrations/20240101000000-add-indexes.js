module.exports = {
  async up(
    queryInterface,
    Sequelize,
  ) {
    // Індекси для таблиці orders
    await queryInterface.addIndex(
      "Orders",
      ["userId"],
    );
    await queryInterface.addIndex(
      "Orders",
      ["status"],
    );
    await queryInterface.addIndex(
      "Orders",
      ["createdAt"],
    );

    // Індекси для таблиці dishes
    await queryInterface.addIndex(
      "Dishes",
      ["category"],
    );
    await queryInterface.addIndex(
      "Dishes",
      [
        "isAvailable",
      ],
    );

    // Складений індекс для OrderDish
    await queryInterface.addIndex(
      "OrderDish",
      [
        "orderId",
        "dishId",
      ],
    );

    // Індекси для reviews
    await queryInterface.addIndex(
      "Reviews",
      ["dishId"],
    );
    await queryInterface.addIndex(
      "Reviews",
      ["userId"],
    );
    await queryInterface.addIndex(
      "Reviews",
      ["rating"],
    );
  },

  async down(
    queryInterface,
    Sequelize,
  ) {
    // Видалення індексів
    await queryInterface.removeIndex(
      "Orders",
      ["userId"],
    );
    await queryInterface.removeIndex(
      "Orders",
      ["status"],
    );
    await queryInterface.removeIndex(
      "Orders",
      ["createdAt"],
    );
    await queryInterface.removeIndex(
      "Dishes",
      ["category"],
    );
    await queryInterface.removeIndex(
      "Dishes",
      [
        "isAvailable",
      ],
    );
    await queryInterface.removeIndex(
      "OrderDish",
      [
        "orderId",
        "dishId",
      ],
    );
    await queryInterface.removeIndex(
      "Reviews",
      ["dishId"],
    );
    await queryInterface.removeIndex(
      "Reviews",
      ["userId"],
    );
    await queryInterface.removeIndex(
      "Reviews",
      ["rating"],
    );
  },
};
