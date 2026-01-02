import { ObjectId } from 'mongoose';

// User Types
export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'customer' | 'admin';
  avatar?: string;
  phone?: string;
  addresses: IAddress[];
  wishlist: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IAddress {
  _id?: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

// Product Types
export interface IProduct {
  _id: string;
  name: string;
  description: string;
  category: 'shoes' | 'bags' | 'clothes';
  subcategory: string;
  brand: string;
  gender: 'men' | 'women' | 'unisex' | 'kids';
  price: number;
  discount: number;
  images: string[];
  variants: IProductVariant[];
  specifications: {
    material?: string;
    weight?: string;
    dimensions?: string;
    [key: string]: any;
  };
  featured: boolean;
  isActive: boolean;
  averageRating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductVariant {
  _id?: string;
  size: string;
  color: string;
  stock: number;
  sku: string;
}

// Review Types
export interface IReview {
  _id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Cart Types
export interface ICart {
  _id: string;
  userId?: string;
  items: ICartItem[];
  updatedAt: Date;
}

export interface ICartItem {
  _id?: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  stock: number;
}

// Order Types
export interface IOrder {
  _id: string;
  orderNumber: string;
  userId: string;
  items: IOrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
  shippingAddress: IAddress;
  paymentInfo: {
    method: string;
    paystackReference?: string;
    paystackAmount?: number;
    paidAt?: Date;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
  };
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderItem {
  productId: string;
  name: string;
  image: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
}