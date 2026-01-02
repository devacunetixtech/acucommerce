import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import { successResponse, errorResponse } from '@/lib/utils/response';
import { requireAdmin } from '@/lib/middleware/auth';

// GET all products (Admin view - includes inactive)
export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const products = await Product.find({})
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments({});

    return successResponse({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return errorResponse(error.message, 403);
    }
    return errorResponse(error.message || 'Failed to fetch products', 500);
  }
}