import { Router } from "express";
import { upload } from "../../utils/multer/multer.js";
import idMiddleware from "../../middlewares/id/id.middleware.js";
import productsController from "../../controllers/products/products.controller.js";
import productsMiddleware from "../../middlewares/products/products.middleware.js";

export const product_routes = Router();

/**
 * @swagger
 * tags:
 *    name: Products
 *    description: Products endpoints
 */

product_routes
  /**
   * @swagger
   * /products/create:
   *   post:
   *     summary: Create a new product
   *     tags: [Products]
   *     description: Create a new product
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               totalAmount:
   *                 type: number
   *                 example: 100
   *               name:
   *                 type: string
   *                 example: "Iphone 13"
   *               price:
   *                 type: number
   *                 example: 2000
   *               productImage:
   *                 type: string
   *                 format: binary
   *     responses:
   *       201:
   *         description: Product created successfully
   *       500:
   *         description: Internal server error
   *       400:
   *         description: Please fill in all fields
   */
  .post(
    "/create",
    upload.single("productImage"),
    productsMiddleware.checkCreate,
    productsController.create
  )
  /**
   * @swagger
   * /products/search:
   *   get:
   *     summary: "Search products by name"
   *     tags: [Products]
   *     description: "This endpoint allows searching for products by name with a partial match."
   *     parameters:
   *       - name: "name"
   *         in: "query"
   *         description: "Search products by name (supports partial match)"
   *         required: true
   *         type: "string"
   *     responses:
   *       200:
   *         description: "Products fetched successfully"
   *         schema:
   *           type: "array"
   *           items:
   *             $ref: "#/definitions/Product"
   *       400:
   *         description: "Name parameter is required"
   *       500:
   *         description: "Internal server error"
   */
  .get("/search", productsController.searchProduct)
  /**
   * @swagger
   * /products/all:
   *   get:
   *     summary: Get all products
   *     tags: [Products]
   *     description: Get all products
   *     responses:
   *       200:
   *         description: All products fetched successfully
   *       500:
   *         description: Internal server error
   */
  .get("/all", productsController.find)
  /**
   * @swagger
   * /products/sell/{id}:
   *   patch:
   *     summary: Sell a product
   *     tags: [Products]
   *     description: Sell a product
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the product to sell
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Product sold successfully
   *       500:
   *         description: Internal server error
   */
  .patch(
    "/sell/:id",
    idMiddleware.checkId,
    productsMiddleware.checkSell,
    productsController.sell
  )
  /**
   * @swagger
   * /products/single/{id}:
   *   get:
   *     summary: Get a single product
   *     tags: [Products]
   *     description: Get a single product
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the product to get
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Single product fetched successfully
   *       500:
   *         description: Internal server error
   */
  .get("/single/:id", idMiddleware.checkId, productsController.findById)
  /**
   * @swagger
   * /products/update/{id}:
   *   patch:
   *     summary: Update a product
   *     tags: [Products]
   *     description: Update a product
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the product to update
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
   *                 example: "Iphone 13"
   *               price:
   *                 type: number
   *                 example: 2000
   *     responses:
   *       200:
   *         description: Product updated successfully
   *       500:
   *         description: Internal server error
   */
  .patch(
    "/update/:id",
    idMiddleware.checkId,
    productsMiddleware.checkUpdate,
    productsController.update
  )
  /**
   * @swagger
   * /products/delete/{id}:
   *   delete:
   *     summary: Delete a product
   *     tags: [Products]
   *     description: Delete a product
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the product to delete
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Product deleted successfully
   *       500:
   *         description: Internal server error
   */
  .delete("/delete/:id", idMiddleware.checkId, productsController.delete)
  /**
   * @swagger
   * /products/download:
   *   get:
   *     summary: Download product
   *     tags: [Products]
   *     description: get products data in excel
   *     responses:
   *       200:
   *         description: product fetched successfully
   *       500:
   *         description: Internal server error
   */
  .get("/download", productsController.download);
