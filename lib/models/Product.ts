import mongoose, { Schema, Model } from 'mongoose';
import { IProduct } from '@/types';

const VariantSchema = new Schema({
  size: { type: String, required: true },
  color: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  sku: { type: String, required: true, unique: true },
});

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, enum: ['shoes', 'bags', 'clothes'], required: true },
    subcategory: { type: String, required: true },
    brand: { type: String, required: true },
    gender: { type: String, enum: ['men', 'women', 'unisex', 'kids'], required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    images: [{ type: String, required: true }],
    variants: [VariantSchema],
    specifications: { type: Map, of: String },
    featured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Index for search
ProductSchema.index({ name: 'text', description: 'text', brand: 'text' });

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;