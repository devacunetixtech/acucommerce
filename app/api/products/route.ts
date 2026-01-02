import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import { successResponse, errorResponse } from '@/lib/utils/response';
import { requireAdmin } from '@/lib/middleware/auth';

// GET all products
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const gender = searchParams.get('gender');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    // Build query
    let query: any = { isActive: true };
    
    if (category) query.category = category;
    if (gender) query.gender = gender;
    if (search) query.$text = { $search: search };

    // Execute query
    const products = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

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
    console.error('Get products error:', error);
    return errorResponse(error.message || 'Failed to fetch products', 500);
  }
}

// POST create product (Admin only)
export async function POST(request: NextRequest) {
  try {
    // Verify admin
    requireAdmin(request);
    
    await connectDB();

    const data = await request.json();

    const product = await Product.create(data);

    return successResponse(product, 'Product created successfully', 201);
  } catch (error: any) {
    console.error('Create product error:', error);
    
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return errorResponse(error.message, 403);
    }
    
    return errorResponse(error.message || 'Failed to create product', 500);
  }
}