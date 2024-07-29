import mongoose, { Document, Schema } from "mongoose";

interface IProduct extends Document {
  id: string;
  productName: string;
  productDescription: string;
  price: number;
  category: string;
  stockQuantity: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  productName: { type: String, required: true },
  productDescription: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  stockQuantity: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

ProductSchema.pre<IProduct>("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Product = mongoose.model<IProduct>("Product", ProductSchema);
export default Product;
