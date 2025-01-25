import { Router } from "express";
import checkToken from "../../secure/tokens/check.token.js";
import integrationsController from "../../controllers/integrations/integrations.controller.js";

export const integration_router = Router();

integration_router
  .get("/get/data", checkToken.checkAdminToken, integrationsController.getData)
  .get(
    "/statistics/:id/:data",
    checkToken.checkAdminToken,
    integrationsController.contactStats
  );
