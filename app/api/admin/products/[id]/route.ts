import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import { successResponse, errorResponse } from '@/lib/utils/response';
import { requireAdmin } from '@/lib/middleware/auth';

// Define the params interface for Next.js 15/16+ (params is a Promise now)
interface RouteProps {
  params: Promise<{ id: string }>;
}

// DELETE: Remove a specific product
export async function DELETE(request: NextRequest, props: RouteProps) {
  try {
    // 1. Authenticate
    requireAdmin(request); // Assuming this throws if invalid
    
    // 2. Connect DB
    await connectDB();

    // 3. Get ID safely (awaiting params is required in Next.js 15+)
    const { id } = await props.params;

    // 4. Perform Delete
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return errorResponse('Product not found', 404);
    }

    return successResponse({ message: 'Product deleted successfully' });

  } catch (error: any) {
    // Handle auth errors explicitly if your middleware throws them
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return errorResponse(error.message, 403);
    }
    return errorResponse(error.message || 'Failed to delete product', 500);
  }
}

// PUT: Update a specific product
export async function PUT(request: NextRequest, props: RouteProps) {
  try {
    requireAdmin(request);
    await connectDB();

    const { id } = await props.params;
    const body = await request.json();

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return errorResponse('Product not found', 404);
    }

    return successResponse({ product: updatedProduct });

  } catch (error: any) {
    return errorResponse(error.message || 'Failed to update product', 500);
  }
}

// GET: Fetch a single product (Useful for the "Edit Product" page)
export async function GET(request: NextRequest, props: RouteProps) {
  try {
    // Note: Usually public, but you can requireAdmin if this is strictly for admin editing
    await connectDB();
    const { id } = await props.params;

    const product = await Product.findById(id);

    if (!product) {
      return errorResponse('Product not found', 404);
    }

    return successResponse({ product });

  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch product', 500);
  }
}