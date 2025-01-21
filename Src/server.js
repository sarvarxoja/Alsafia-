import "dotenv/config";
import "./config/index.js";

import path from "path";
import cors from "cors";
import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";

/////////////////////////////////////////////////////// ====> SECURE <==== /////////////////////////////////////////////////////////////

import checkKey from "./secure/api/check.key.js";
import checkToken from "./secure/tokens/check.token.js";

///////////////////////////////////////////////////////// ====> ROUTES <==== /////////////////////////////////////////////////////////

import { swaggerDocs } from "./utils/swagger/swagger.js";
import { auth_router } from "./routes/auth/auth.routes.js";
import { admin_router } from "./routes/admins/admin.routes.js";
import { product_routes } from "./routes/products/products.routes.js";
import { employee_routes } from "./routes/employees/employees.routes.js";
import dashboardController from "./controllers/dashboard/dashboard.controller.js";
import integrationsController from "./controllers/integrations/integrations.controller.js";

const app = express();

async function starter() {
  try {
    const PORT = process.env.PORT;

    app.use(
      cors({
        origin: "http://localhost:5173",
        credentials: true,
      })
    );
    app.use(cookieParser());
    app.use(
      session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: false, // Agar HTTPS ishlatayotgan bo'lsangiz, true qiling
          httpOnly: true,
        },
      })
    );
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
    app.use(express.static(path.join(path.resolve(), "uploads")));

    app.get("/get/bitrix/data", integrationsController.getData);
    app.use(checkKey.checkApiKey);
    app.use("/auth", auth_router);
    app.use("/admin", admin_router);
    app.use("/products", product_routes);
    app.use("/employee", employee_routes);
    app.get(
      "/dashboard",
      checkToken.checkAdminToken,
      dashboardController.getProductsData
    );
    app.get(
      "/employees/dashboard",
      checkToken.checkAdminToken,
      dashboardController.getEmployeeStats
    );

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

export default app;
