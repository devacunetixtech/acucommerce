import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import { successResponse, errorResponse } from '@/lib/utils/response';
import { requireAuth } from '@/lib/middleware/auth';

// 1. Define params as a Promise
type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = requireAuth(request);
    await connectDB();

    // 2. Await the params before accessing the ID
    const { id } = await params;

    // Diagnostic: log incoming ids
    console.log('Fetch order details - ID:', id, 'User ID:', user.id);

    // First try: ensure order belongs to the authenticated user
    // Use 'id' variable here, not params.id
    const order = await Order.findOne({ _id: id, userId: user.id })
      .populate('items.productId', 'name price images'); // Optional: populate if needed

    // If not found, check if order exists at all (helps determine ownership vs missing)
    if (!order) {
      const maybeOrder = await Order.findById(id);
      if (maybeOrder) {
        console.warn('Order exists but does not belong to user', { 
            orderId: id, 
            owner: maybeOrder.userId, 
            requester: user.id 
        });
        return errorResponse('Forbidden: You do not have access to this order', 403);
      }
    }

    if (!order) {
      return errorResponse('Order not found', 404);
    }

    return successResponse(order);
  } catch (error: any) {
    console.error('Fetch order error:', error);
    if (error.message === 'Unauthorized') {
      return errorResponse(error.message, 401);
    }
    return errorResponse(error.message || 'Failed to fetch order', 500);
  }
}