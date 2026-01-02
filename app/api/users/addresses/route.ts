import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { successResponse, errorResponse } from '@/lib/utils/response';
import { requireAuth } from '@/lib/middleware/auth';

// POST add new address
export async function POST(request: NextRequest) {
  try {
    const user = requireAuth(request);
    await connectDB();

    const addressData = await request.json();

    const userDoc = await User.findById(user.id);

    if (!userDoc) {
      return errorResponse('User not found', 404);
    }

    // If this is the first address or marked as default, make it default
    if (userDoc.addresses.length === 0 || addressData.isDefault) {
      // Remove default from other addresses
      userDoc.addresses.forEach((addr: any) => {
        addr.isDefault = false;
      });
      addressData.isDefault = true;
    }

    userDoc.addresses.push(addressData);
    await userDoc.save();

    return successResponse(
      userDoc.addresses[userDoc.addresses.length - 1],
      'Address added successfully',
      201
    );
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return errorResponse(error.message, 401);
    }
    return errorResponse(error.message || 'Failed to add address', 500);
  }
}

// GET all addresses
export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request);
    await connectDB();

    const userDoc = await User.findById(user.id).select('addresses');

    if (!userDoc) {
      return errorResponse('User not found', 404);
    }

    return successResponse(userDoc.addresses);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return errorResponse(error.message, 401);
    }
    return errorResponse(error.message || 'Failed to fetch addresses', 500);
  }
}