import { Router } from "express";
import checkToken from "../../secure/tokens/check.token.js";
import integrationsController from "../../controllers/integrations/integrations.controller.js";

export const integration_router = Router();
// checkToken.checkAdminToken,

integration_router
  .get("/get/data", integrationsController.getData)
  .get(
    "/statistics/:id/:data",
    checkToken.checkHrToken,
    integrationsController.contactStats
  )
  .post(
    "/statistic/long/:userId",
    // checkToken.checkHrToken,
    integrationsController.getUserTaskStatsForRange
  )
  .get(
    "/all/statistics/data/:id",
    integrationsController.getAllStatistics
  );
