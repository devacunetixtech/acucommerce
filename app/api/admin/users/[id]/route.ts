import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { successResponse, errorResponse } from '@/lib/utils/response';
import { requireAdmin } from '@/lib/middleware/auth';

// GET single user
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    requireAdmin(request);
    await connectDB();

    const user = await User.findById(params.id).select('-password');

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
  { params }: { params: { id: string } }
) {
  try {
    requireAdmin(request);
    await connectDB();

    const { role, isActive } = await request.json();

    const user = await User.findById(params.id);

    if (!user) {
      return errorResponse('User not found', 404);
    }

    if (role) user.role = role;
    if (typeof isActive !== 'undefined' && 'isActive' in user) user.isActive = isActive;

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
  { params }: { params: { id: string } }
) {
  try {
    requireAdmin(request);
    await connectDB();

    const user = await User.findByIdAndDelete(params.id);

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