import express, { Request, Response } from "express";
import Product from "../models/Product";

const router = express.Router();

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
