import path from "path";
import { fileURLToPath } from "url";
import swaggerJSDoc from "swagger-jsdoc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "API for Express.js application",
    },
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "x-api-key",  // API keyni headerda qabul qilish
        },
        CookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "accessToken",  // Tokenni cookie'dan olish
        },
      },
    },
    security: [
      {
        ApiKeyAuth: [],  // API keyni headerdan so'rash
      },
      {
        CookieAuth: [],  // Tokenni cookie'dan so'rash
      },
    ],
  },
  apis: [path.join(__dirname, "../../routes/**/*.js")],
};

export const swaggerDocs = swaggerJSDoc(swaggerOptions);