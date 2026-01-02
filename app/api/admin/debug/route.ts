import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import { successResponse } from '@/lib/utils/response';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const orders = await Order.find({}).limit(10);
    const count = await Order.countDocuments();

    return successResponse({
      count,
      orders: orders.map(o => ({
        _id: o._id,
        orderNumber: o.orderNumber,
        status: o.status,
        paymentStatus: o.paymentInfo.status,
        total: o.total,
        userId: o.userId,
        createdAt: o.createdAt,
      })),
    });
  } catch (error: any) {
    return successResponse({ error: error.message, orders: [] });
  }
}