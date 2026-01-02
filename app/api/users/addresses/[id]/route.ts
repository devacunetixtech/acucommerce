import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { successResponse, errorResponse } from '@/lib/utils/response';
import { requireAuth } from '@/lib/middleware/auth';

// 1. Define the correct type for Next.js 15
type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

// PUT update address
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const user = requireAuth(request);
    await connectDB();

    // 2. Await params before accessing properties
    const { id } = await params;

    const addressData = await request.json();
    const userDoc = await User.findById(user.id);

    if (!userDoc) {
      return errorResponse('User not found', 404);
    }

    // FIXED: Use .find() instead of .id() to satisfy TypeScript
    // We treat 'addr' as any to safely access _id without interface conflicts
    const address = userDoc.addresses.find((addr: any) => addr._id.toString() === id);

    if (!address) {
      return errorResponse('Address not found', 404);
    }

    // If setting as default, remove default from others
    if (addressData.isDefault) {
      userDoc.addresses.forEach((addr: any) => {
        addr.isDefault = false;
      });
    }

    // Update address fields
    Object.assign(address, addressData);
    await userDoc.save();

    return successResponse(address, 'Address updated successfully');
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return errorResponse(error.message, 401);
    }
    return errorResponse(error.message || 'Failed to update address', 500);
  }
}

// DELETE address
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const user = requireAuth(request);
    await connectDB();

    // 2. Await params here as well
    const { id } = await params;

    const userDoc = await User.findById(user.id);

    if (!userDoc) {
      return errorResponse('User not found', 404);
    }

    // FIXED: Use .find() instead of .id()
    const address = userDoc.addresses.find((addr: any) => addr._id.toString() === id);

    if (!address) {
      return errorResponse('Address not found', 404);
    }

    const wasDefault = address.isDefault;

    // FIXED: Cast addresses to 'any' to usage Mongoose's .pull() method
    // without TypeScript complaining that it doesn't exist on IAddress[]
    (userDoc.addresses as any).pull(id);

    // If it was default and there are other addresses, make first one default
    if (wasDefault && userDoc.addresses.length > 0) {
      userDoc.addresses[0].isDefault = true;
    }

    await userDoc.save();

    return successResponse(null, 'Address deleted successfully');
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return errorResponse(error.message, 401);
    }
    return errorResponse(error.message || 'Failed to delete address', 500);
  }
}