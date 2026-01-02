import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { successResponse, errorResponse } from '@/lib/utils/response';
import { requireAuth } from '@/lib/middleware/auth';

// GET user profile
export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request);
    await connectDB();

    const userProfile = await User.findById(user.id).select('-password');

    if (!userProfile) {
      return errorResponse('User not found', 404);
    }

    return successResponse(userProfile);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return errorResponse(error.message, 401);
    }
    return errorResponse(error.message || 'Failed to fetch profile', 500);
  }
}

// PUT update user profile
export async function PUT(request: NextRequest) {
  try {
    const user = requireAuth(request);
    await connectDB();

    const { name, phone, avatar } = await request.json();

    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      { name, phone, avatar },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return errorResponse('User not found', 404);
    }

    return successResponse(updatedUser, 'Profile updated successfully');
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return errorResponse(error.message, 401);
    }
    return errorResponse(error.message || 'Failed to update profile', 500);
  }
}