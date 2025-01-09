import { Router } from "express";
import idMiddleware from "../../middlewares/id/id.middleware.js";
import employeesController from "../../controllers/users/employees.controller.js";
import employeesMiddleware from "../../middlewares/employe/employees.middleware.js";

export const employee_routes = Router();

/**
 * @swagger
 * tags:
 *   - name: Employees
 *     description: Employees endpoints
 */

employee_routes
  /**
   * @swagger
   * /employee/create:
   *   post:
   *     summary: Create a new employee
   *     tags: 
   *       - Employees
   *     description: Create a new employee
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
   *               email:
   *                 type: string
   *                 example: "sarvar@example.com"
   *               position:
   *                 type: string
   *                 example: "Developer"
   *               dateOfEmployment:
   *                 type: string
   *                 example: "2022-01-01"
   *               dateOfBirth:
   *                 type: string
   *                 example: "1999-01-01"
   *               parentName:
   *                 type: string
   *                 example: "Ismoil"
   *               salaryType:
   *                 type: string
   *                 example: "Monthly"
   *               comment:
   *                 type: string
   *                 example: "Good employee"
   *     responses:
   *       201:
   *         description: Employee created successfully
   *       500:
   *         description: Internal server error
   *       400:
   *         description: Please fill in all fields
   */
  .post("/create", employeesMiddleware.checkCreate, employeesController.create)
  /**
   * @swagger
   * /employee/all:
   *   get:
   *     summary: Get all employees
   *     tags: [Employees]
   *     description: Get all employees
   *     responses:
   *       200:
   *         description: Employees fetched successfully
   *       500:
   *         description: Internal server error
   */
  .get("/get/all", employeesController.find)
  /**
   * @swagger
   * /employee/{id}:
   *   get:
   *     summary: Get employee by id
   *     tags: [Employees]
   *     description: Get employee by id
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Employee id
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Employee fetched successfully
   *       500:
   *         description: Internal server error
   */
  .get("/:id", idMiddleware.checkId, employeesController.findById)
  /**
   * @swagger
   * /employee/update/{id}:
   *   patch:
   *     summary: Update employee by id
   *     tags: [Employees]
   *     description: Update employee by id
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Employee id
   *         schema:
   *           type: string
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
   *               email:
   *                 type: string
   *                 example: "sarvar@gmail.com"
   *     responses:
   *       200:
   *         description: Employee updated successfully
   *       500:
   *         description: Internal server error
   *       400:
   *         description: Please fill in all fields
   */
  .patch(
    "/update/:id",
    idMiddleware.checkId,
    employeesMiddleware.checkUpdate,
    employeesController.update
  )
  /**
   * @swagger
   * /employee/delete/{id}:
   *   delete:
   *     summary: Delete employee by id
   *     tags: [Employees]
   *     description: Delete employee by id
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Employee id
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Employee deleted successfully
   *       500:
   *         description: Internal server error
   */
  .delete("/delete/:id", idMiddleware.checkId, employeesController.delete);