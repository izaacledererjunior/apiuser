import swaggerJsDoc from "swagger-jsdoc";
import dotenv from "dotenv";
dotenv.config();

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User API",
      version: "1.0.0",
      description: "User Management API Documentation",
    },
    servers: [
      {
        url: `${process.env.SWAGGER_URL}`,
        description: "Dev stage server",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",

          scheme: "bearer",

          bearerFormat: "JWT",
        },
      },

      schemas: {
        RegisterUser: {
          type: "object",

          required: ["email", "password"],

          properties: {
            email: {
              type: "string",

              example: "user@example.com",
            },

            password: {
              type: "string",

              example: "password123",
            },
          },
        },

        UpdateUser: {
          type: "object",

          properties: {
            email: {
              type: "string",

              example: "user@example.com",
            },

            password: {
              type: "string",

              example: "password123",
            },
          },
        },
      },
    },

    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/server.*", "./dist/server.*"],
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);
export default swaggerSpec;
