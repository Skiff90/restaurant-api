const Joi = require("joi");

const schemas = {
  userRegister:
    Joi.object({
      name: Joi.string()
        .min(2)
        .max(50)
        .required(),
      email:
        Joi.string()
          .email()
          .required(),
      password:
        Joi.string()
          .min(6)
          .required(),
    }),

  userLogin:
    Joi.object({
      email:
        Joi.string()
          .email()
          .required(),
      password:
        Joi.string().required(),
    }),

  dish: Joi.object({
    name: Joi.string()
      .min(2)
      .max(100)
      .required(),
    description:
      Joi.string().max(
        500,
      ),
    price:
      Joi.number()
        .positive()
        .required(),
    category:
      Joi.string().required(),
    imageUrl:
      Joi.string().uri(),
  }),

  order: Joi.object(
    {
      dishes:
        Joi.array()
          .items(
            Joi.object(
              {
                dishId:
                  Joi.string()
                    .uuid()
                    .required(),
                quantity:
                  Joi.number()
                    .integer()
                    .min(
                      1,
                    )
                    .required(),
              },
            ),
          )
          .required(),
    },
  ),

  reviewSchema:
    Joi.object({
      dishId:
        Joi.string()
          .uuid()
          .required(),
      rating:
        Joi.number()
          .integer()
          .min(1)
          .max(5)
          .required(),
      comment:
        Joi.string().max(
          1000,
        ),
      images:
        Joi.array().items(
          Joi.string().uri(),
        ),
    }),
};

module.exports =
  schemas;
