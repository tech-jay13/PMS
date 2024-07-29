import express, { Request, Response } from "express";
import Product from "../models/Product";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - id
 *         - productName
 *         - productDescription
 *         - price
 *         - category
 *         - stockQuantity
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the product
 *         productName:
 *           type: string
 *           description: Name of the product
 *         productDescription:
 *           type: string
 *           description: Description of the product
 *         price:
 *           type: number
 *           description: Price of the product
 *         category:
 *           type: string
 *           description: Category of the product
 *         stockQuantity:
 *           type: number
 *           description: Quantity of the product in stock
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the product was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the product was last updated
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: The products managing API
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: The product was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Bad request
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      id,
      productName,
      productDescription,
      price,
      category,
      stockQuantity,
    } = req.body;

    const existingProduct = await Product.findOne({ id });
    if (existingProduct) {
      return res
        .status(400)
        .json({ error: "Product with this ID already exists" });
    }

    const newProduct = new Product({
      id,
      productName,
      productDescription,
      price,
      category,
      stockQuantity,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const product = await newProduct.save();
    res.status(201).json(product);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Unknown error" });
    }
  }
});



/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update an existing product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: The product was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: The product was not found
 *       400:
 *         description: Bad request
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unknown error' });
    }
  }
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product id
 *     responses:
 *       200:
 *         description: The product was successfully deleted
 *       404:
 *         description: The product was not found
 *       400:
 *         description: Bad request
 */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({ id: req.params.id });
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Unknown error" });
    }
  }
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Retrieve a product by its ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product id
 *     responses:
 *       200:
 *         description: The product description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: The product was not found
 *       400:
 *         description: Bad request
 */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Unknown error" });
    }
  }
});


/**
 * @swagger
 * /products:
 *   get:
 *     summary: List all products with optional filters and pagination
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         required: false
 *         description: The product category
 *       - in: query
 *         name: price
 *         schema:
 *           type: number
 *         required: false
 *         description: The product price
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         required: false
 *         description: The page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         required: false
 *         description: The number of products per page
 *     responses:
 *       200:
 *         description: List of products with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *                   description: The total number of products
 *                 page:
 *                   type: number
 *                   description: The current page number
 *                 limit:
 *                   type: number
 *                   description: The number of products per page
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       400:
 *         description: Bad request
 */

router.get("/", async (req: Request, res: Response) => {
  try {
    const { category, price, page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const pageSize = parseInt(limit as string, 10);

    const filters: any = {};
    if (category) filters.category = category;
    if (price) filters.price = price;

    const total = await Product.countDocuments(filters);

    // Fetch the products with pagination
    const products = await Product.find(filters)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    res.json({
      total,
      page: pageNumber,
      limit: pageSize,
      products,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Unknown error" });
    }
  }
});


export default router;
