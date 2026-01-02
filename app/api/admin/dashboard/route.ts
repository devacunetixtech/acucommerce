import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import Order from '@/lib/models/Order';
import User from '@/lib/models/User';
import { successResponse, errorResponse } from '@/lib/utils/response';
import { requireAdmin } from '@/lib/middleware/auth';

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);
    await connectDB();

    // Get statistics
    const totalProducts = await Product.countDocuments({});
    const totalOrders = await Order.countDocuments({});
    const totalUsers = await User.countDocuments({ role: 'customer' });

    // Calculate total revenue
    const orders = await Order.find({ 'paymentInfo.status': 'completed' });
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

    // Recent orders
    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name email');

    // Low stock products
    const lowStockProducts = await Product.find({
      'variants.stock': { $lt: 10 },
      isActive: true,
    }).limit(5);

    return successResponse({
      stats: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue,
      },
      recentOrders,
      lowStockProducts,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return errorResponse(error.message, 403);
    }
    return errorResponse(error.message || 'Failed to fetch dashboard data', 500);
  }
}