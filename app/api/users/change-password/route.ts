import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { successResponse, errorResponse } from '@/lib/utils/response';
import { requireAuth } from '@/lib/middleware/auth';
import { comparePassword, hashPassword } from '@/lib/utils/auth';

export async function PUT(request: NextRequest) {
  try {
    const user = requireAuth(request);
    await connectDB();

    const { currentPassword, newPassword } = await request.json();

    // Validation
    if (!currentPassword || !newPassword) {
      return errorResponse('Please provide current and new password', 400);
    }

    if (newPassword.length < 6) {
      return errorResponse('New password must be at least 6 characters', 400);
    }

    // Get user with password
    const userDoc = await User.findById(user.id).select('+password');

    if (!userDoc) {
      return errorResponse('User not found', 404);
    }

    // Verify current password
    const isPasswordValid = await comparePassword(currentPassword, userDoc.password);

    if (!isPasswordValid) {
      return errorResponse('Current password is incorrect', 401);
    }

    // Hash new password
    userDoc.password = await hashPassword(newPassword);
    await userDoc.save();

    return successResponse(null, 'Password changed successfully');
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return errorResponse(error.message, 401);
    }
    return errorResponse(error.message || 'Failed to change password', 500);
  }
}