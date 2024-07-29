import Product, { IProduct } from "../models/Product";

// Create a new product
export const createProduct = async (productData: IProduct) => {
  const {
    id,
    productName,
    productDescription,
    price,
    category,
    stockQuantity,
  } = productData;

  const existingProduct = await Product.findOne({ id });
  if (existingProduct) {
    throw new Error("Product with this ID already exists");
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

  return await newProduct.save();
};

// Update an existing product
export const updateProduct = async (id: string, updateData: any) => {
  const updatedProduct = await Product.findOneAndUpdate({ id }, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedProduct) {
    throw new Error("Product not found");
  }

  return updatedProduct;
};

// Delete a product
export const deleteProduct = async (id: string) => {
  const deletedProduct = await Product.findOneAndDelete({ id });
  if (!deletedProduct) {
    throw new Error("Product not found");
  }
  return deletedProduct;
};

// Get a product by ID
export const getProductById = async (id: string) => {
  const product = await Product.findOne({ id });
  if (!product) {
    throw new Error("Product not found");
  }
  return product;
};

// List all products with optional filters and pagination
export const listProducts = async (
  filters: any,
  page: number,
  limit: number
) => {
  const total = await Product.countDocuments(filters);
  const products = await Product.find(filters)
    .skip((page - 1) * limit)
    .limit(limit);

  return { total, products };
};
