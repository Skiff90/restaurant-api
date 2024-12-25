const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi:
      "3.0.0",
    info: {
      title:
        "Restaurant API Documentation",
      version:
        "1.0.0",
      description:
        "API documentation for Restaurant Management System",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
        description:
          "Development server",
      },
    ],
    components: {
      securitySchemes:
        {
          bearerAuth:
            {
              type: "http",
              scheme:
                "bearer",
              bearerFormat:
                "JWT",
            },
        },
    },
  },
  apis: [
    "./src/routes/*.js",
  ], // шляхи до файлів з маршрутами
};

const specs =
  swaggerJsdoc(
    options,
  );
module.exports =
  specs;
