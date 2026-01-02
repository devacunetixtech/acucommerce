import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import { successResponse, errorResponse } from '@/lib/utils/response';
import { requireAdmin } from '@/lib/middleware/auth';

// Define the params type as a Promise
type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

// GET single order details (Admin)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    requireAdmin(request);
    await connectDB();

    // FIXED: Await params before accessing properties
    const { id } = await params;

    const order = await Order.findById(id)
      .populate('userId', 'name email phone address')
      .populate('items.productId', 'name price images');

    if (!order) {
      return errorResponse('Order not found', 404);
    }

    return successResponse(order);
  } catch (error: any) {
    console.error('Admin order fetch error:', error);
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return errorResponse(error.message, 403);
    }
    return errorResponse('Failed to fetch order details', 500);
  }
}

// PATCH update order status (Admin)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    requireAdmin(request);
    await connectDB();

    // FIXED: Await params
    const { id } = await params;
    const body = await request.json();
    const { status, paymentStatus, trackingNumber } = body;

    const order = await Order.findById(id);

    if (!order) {
      return errorResponse('Order not found', 404);
    }

    if (status) order.status = status;
    if (paymentStatus) (order as any).paymentStatus = paymentStatus;
    if (trackingNumber) order.trackingNumber = trackingNumber;

    const updatedOrder = await order.save();

    return successResponse(updatedOrder, 'Order updated successfully');
  } catch (error: any) {
    console.error('Admin order update error:', error);
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return errorResponse(error.message, 403);
    }
    return errorResponse('Failed to update order', 500);
  }
}

// DELETE order (Admin)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    requireAdmin(request);
    await connectDB();

    // FIXED: Await params
    const { id } = await params;

    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return errorResponse('Order not found', 404);
    }

    return successResponse(null, 'Order deleted successfully');
  } catch (error: any) {
    console.error('Admin order delete error:', error);
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return errorResponse(error.message, 403);
    }
    return errorResponse('Failed to delete order', 500);
  }
}