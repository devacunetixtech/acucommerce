import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { successResponse, errorResponse } from '@/lib/utils/response';
import { requireAdmin } from '@/lib/middleware/auth';

// 1. Define params as a Promise
type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

// GET single user
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    requireAdmin(request);
    await connectDB();

    // 2. Await params
    const { id } = await params;

    const user = await User.findById(id).select('-password');

    if (!user) {
      return errorResponse('User not found', 404);
    }

    return successResponse(user);
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return errorResponse(error.message, 403);
    }
    return errorResponse(error.message || 'Failed to fetch user', 500);
  }
}

// PUT update user
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    requireAdmin(request);
    await connectDB();

    // 2. Await params
    const { id } = await params;
    const { role, isActive } = await request.json();

    const user = await User.findById(id);

    if (!user) {
      return errorResponse('User not found', 404);
    }

    if (role) user.role = role;
    
    // Ensure we handle boolean updates correctly (checking for undefined allows false values)
    if (typeof isActive !== 'undefined') {
        user.isActive = isActive;
    }

    await user.save();

    return successResponse(user, 'User updated successfully');
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return errorResponse(error.message, 403);
    }
    return errorResponse(error.message || 'Failed to update user', 500);
  }
}

// DELETE user
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    requireAdmin(request);
    await connectDB();

    // 2. Await params
    const { id } = await params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return errorResponse('User not found', 404);
    }

    return successResponse(null, 'User deleted successfully');
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return errorResponse(error.message, 403);
    }
    return errorResponse(error.message || 'Failed to delete user', 500);
  }
}