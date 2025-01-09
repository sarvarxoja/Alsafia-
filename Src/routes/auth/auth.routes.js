import { Router } from "express";
import { limiter } from "../../secure/limiter/limiter.js";
import checkToken from "../../secure/tokens/check.token.js";
import authController from "../../controllers/auth/auth.controller.js";
import authMiddleware from "../../middlewares/auth/auth.middleware.js";

export const auth_router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

auth_router
  /**
   * @swagger
   * /auth/register:
   *   post:
   *     summary: Register a new admin
   *     tags: [Auth]
   *     description: Register a new admin
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 example: "Sarvar"
   *               lastName:
   *                 type: string
   *                 example: "Ismoilxojayev"
   *               phoneNumber:
   *                 type: string
   *                 example: "998974603262"
   *               password:
   *                 type: string
   *                 example: "loremipsum"
   *     responses:
   *       201:
   *         description: Admin created successfully
   *       500:
   *         description: Internal server error
   *       400:
   *         description: Please fill in all fields
   */
  .post(
    "/register",
    checkToken.checkAdminToken,
    authMiddleware.checkRegister,
    authController.register
  )
  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Admin login
   *     tags: [Auth]
   *     description: Admin login
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               phoneNumber:
   *                 type: string
   *                 example: "+998974603262"
   *               password:
   *                 type: string
   *                 example: "loremipsum"
   *     responses:
   *       200:
   *         description: Admin login successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 name:
   *                   type: string
   *                   example: "Sarvar"
   *                 lastName:
   *                   type: string
   *                   example: "Ismoilxojayev"
   *                 phoneNumber:
   *                   type: string
   *                   example: "998974603262"
   *                 status:
   *                   type: number
   *                   example: 200
   *       401:
   *         description: Wrong email or password
   *       500:
   *         description: Internal server error
   *       429:
   *         description: Too many requests
   */
  .post("/login", authMiddleware.checkLogin, limiter, authController.login)
  /**
   * @swagger
   * /auth/logout:
   *   post:
   *     summary: Admin logout
   *     tags: [Auth]
   *     description: Admin logout
   *     responses:
   *       200:
   *         description: Admin logout successfully
   *       500:
   *         description: Internal server error
   */
  .post("/logout", checkToken.checkAdminToken, authController.logout)
  /**
   * @swagger
   * /auth/refresh/token:
   *   post:
   *     summary: Refresh token
   *     tags: [Auth]
   *     description: Refresh token
   *     responses:
   *       200:
   *         description: Token refreshed successfully
   *       500:
   *         description: Internal server error
   */
  .post(
    "/refresh/token",
    checkToken.checkAdminToken,
    authController.refreshToken
  );
