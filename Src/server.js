import "dotenv/config";
import "./config/index.js";

import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";

/////////////////////////////////////////////////////// ====> SECURE <==== /////////////////////////////////////////////////////////////

import checkKey from "./secure/api/check.key.js";
import checkToken from "./secure/tokens/check.token.js";

///////////////////////////////////////////////////////// ====> ROUTES <==== /////////////////////////////////////////////////////////

import { swaggerDocs } from "./utils/swagger/swagger.js";
import { auth_router } from "./routes/auth/auth.routes.js";
import { product_routes } from "./routes/products/products.routes.js";
import { employee_routes } from "./routes/employees/employees.routes.js";

async function starter() {
  try {
    const app = express();
    const PORT = process.env.PORT;

    app.use(cors());
    app.use(express.json());
    app.use(cookieParser());

    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

    app.use(checkKey.checkApiKey);

    app.use("/auth", auth_router);
    app.use("/products", checkToken.checkAdminToken, product_routes);
    app.use("/employee", checkToken.checkAdminToken, employee_routes);

    app.use((req, res) => {
      res.status(404).json({
        message: "This route does not exist. Please check the URL.",
        status: 404,
      });
    });

    app.listen(PORT, console.log(`server is running on ${PORT} port!!`));
  } catch (error) {
    console.log(error.message);
  }
}

starter();
