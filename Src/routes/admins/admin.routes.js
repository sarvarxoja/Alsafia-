import { Router } from "express";
import checkToken from "../../secure/tokens/check.token.js";
import idMiddleware from "../../middlewares/id/id.middleware.js";
import adminsMiddleware from "../../middlewares/admin/admins.middleware.js";
import adminsController from "../../controllers/admins/admins.controller.js";

export const admin_router = Router()
  .get("/all", checkToken.checkAdminToken, adminsController.getAll)
  .get("/search", checkToken.checkAdminToken, adminsController.search)
  .get("/profile/me", checkToken.checkUserToken, adminsController.profileMe)
  .get(
    "/get/:id",
    checkToken.checkUserToken,
    idMiddleware.checkId,
    adminsController.getById
  )
  .delete("/delete/:id", checkToken.checkAdminToken, adminsController.delete)
  .patch(
    "/update/:id",
    adminsMiddleware.checkAdminUpdate,
    checkToken.checkAdminToken,
    adminsController.update
  );
