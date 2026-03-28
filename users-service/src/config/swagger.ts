import swaggerJSDoc from "swagger-jsdoc";

import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Users Service API",
      version: "1.0.0",
      description: "Documentación de la API",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/modules/**/infrastructure/http/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
