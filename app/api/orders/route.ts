import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import Cart from '@/lib/models/Cart';
import Product from '@/lib/models/Product';
import { successResponse, errorResponse } from '@/lib/utils/response';
import { requireAuth } from '@/lib/middleware/auth';
import { generateOrderNumber } from '@/lib/utils/helpers';

// GET user orders
export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request);
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const orders = await Order.find({ userId: user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments({ userId: user.id });

    return successResponse({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return errorResponse(error.message, 401);
    }
    return errorResponse(error.message || 'Failed to fetch orders', 500);
  }
}

// POST create order
export async function POST(request: NextRequest) {
  try {
    const user = requireAuth(request);
    await connectDB();

    const { items, shippingAddress, paymentMethod } = await request.json();

    // Validate items
    if (!items || items.length === 0) {
      return errorResponse('No items in order', 400);
    }

    // Validate shipping address
    if (!shippingAddress) {
      return errorResponse('Shipping address is required', 400);
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return errorResponse(`Product ${item.productId} not found`, 404);
      }

      // Check stock
      const variant = product.variants.find(
        (v: any) => v.size === item.size && v.color === item.color
      );

      if (!variant || variant.stock < item.quantity) {
        return errorResponse(`Insufficient stock for ${product.name}`, 400);
      }

      subtotal += item.price * item.quantity;
      orderItems.push({
        productId: item.productId,
        name: item.name,
        image: item.image,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: item.price,
      });

      // Update stock
      variant.stock -= item.quantity;
      await product.save();
    }

    const shippingCost = subtotal > 50000 ? 0 : 2500; // Free shipping over ₦50,000
    const tax = subtotal * 0.075; // 7.5% VAT
    const total = subtotal + shippingCost + tax;

    // Create order
    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      userId: user.id,
      items: orderItems,
      subtotal,
      shippingCost,
      tax,
      discount: 0,
      total,
      shippingAddress,
      paymentInfo: {
        method: paymentMethod,
        status: 'pending',
      },
      status: 'pending',
    });

    // Clear user's cart
    await Cart.findOneAndUpdate(
      { userId: user.id },
      { items: [] }
    );

    return successResponse(order, 'Order created successfully', 201);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return errorResponse(error.message, 401);
    }
    console.error('Create order error:', error);
    return errorResponse(error.message || 'Failed to create order', 500);
  }
}