import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import Cart from '@/lib/models/Cart';
import Product from '@/lib/models/Product';
import { successResponse, errorResponse } from '@/lib/utils/response';
import { requireAuth } from '@/lib/middleware/auth';

// GET user cart
export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request);
    await connectDB();

    let cart = await Cart.findOne({ userId: user.id }).populate('items.productId');

    if (!cart) {
      cart = await Cart.create({ userId: user.id, items: [] });
    }

    return successResponse(cart);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return errorResponse(error.message, 401);
    }
    return errorResponse(error.message || 'Failed to fetch cart', 500);
  }
}

// POST add item to cart
export async function POST(request: NextRequest) {
  try {
    const user = requireAuth(request);
    await connectDB();

    const { productId, size, color, quantity } = await request.json();

    // Validate product
    const product = await Product.findById(productId);
    if (!product) {
      return errorResponse('Product not found', 404);
    }

    // Check stock
    const variant = product.variants.find(
      (v: any) => v.size === size && v.color === color
    );

    if (!variant || variant.stock < quantity) {
      return errorResponse('Insufficient stock', 400);
    }

    let cart = await Cart.findOne({ userId: user.id });

    if (!cart) {
      cart = await Cart.create({ userId: user.id, items: [] });
    }

    // Check if item already exists
    const existingItemIndex = cart.items.findIndex(
      (item: any) =>
        item.productId.toString() === productId &&
        item.size === size &&
        item.color === color
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        productId,
        name: product.name,
        image: product.images[0],
        price: product.discount > 0 
          ? product.price - (product.price * product.discount / 100)
          : product.price,
        size,
        color,
        quantity,
        stock: variant.stock,
      });
    }

    await cart.save();

    return successResponse(cart, 'Item added to cart');
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return errorResponse(error.message, 401);
    }
    return errorResponse(error.message || 'Failed to add to cart', 500);
  }
}

// PUT update cart item
export async function PUT(request: NextRequest) {
  try {
    const user = requireAuth(request);
    await connectDB();

    const { productId, size, color, quantity } = await request.json();

    const cart = await Cart.findOne({ userId: user.id });

    if (!cart) {
      return errorResponse('Cart not found', 404);
    }

    const itemIndex = cart.items.findIndex(
      (item: any) =>
        item.productId.toString() === productId &&
        item.size === size &&
        item.color === color
    );

    if (itemIndex === -1) {
      return errorResponse('Item not found in cart', 404);
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();

    return successResponse(cart, 'Cart updated');
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return errorResponse(error.message, 401);
    }
    return errorResponse(error.message || 'Failed to update cart', 500);
  }
}

// DELETE remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    const user = requireAuth(request);
    await connectDB();

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const size = searchParams.get('size');
    const color = searchParams.get('color');

    const cart = await Cart.findOne({ userId: user.id });

    if (!cart) {
      return errorResponse('Cart not found', 404);
    }

    cart.items = cart.items.filter(
      (item: any) =>
        !(
          item.productId.toString() === productId &&
          item.size === size &&
          item.color === color
        )
    );

    await cart.save();

    return successResponse(cart, 'Item removed from cart');
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return errorResponse(error.message, 401);
    }
    return errorResponse(error.message || 'Failed to remove from cart', 500);
  }
}