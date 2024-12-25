const {
  DataTypes,
} = require("sequelize");
const sequelize = require("../config/db.config");

const Review =
  sequelize.define(
    "Review",
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
      dishId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
      comment: {
        type: DataTypes.TEXT,
      },
      images: {
        type: DataTypes.ARRAY(
          DataTypes.STRING,
        ),
        defaultValue:
          [],
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
  );

module.exports =
  Review;
