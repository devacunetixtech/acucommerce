import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { successResponse, errorResponse } from '@/lib/utils/response';
import { requireAuth } from '@/lib/middleware/auth';

// PUT update address
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = requireAuth(request);
    await connectDB();

    const addressData = await request.json();

    const userDoc = await User.findById(user.id);

    if (!userDoc) {
      return errorResponse('User not found', 404);
    }

    const address = userDoc.addresses.id(params.id);

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
  { params }: { params: { id: string } }
) {
  try {
    const user = requireAuth(request);
    await connectDB();

    const userDoc = await User.findById(user.id);

    if (!userDoc) {
      return errorResponse('User not found', 404);
    }

    const address = userDoc.addresses.id(params.id);

    if (!address) {
      return errorResponse('Address not found', 404);
    }

    const wasDefault = address.isDefault;

    // Remove address
    userDoc.addresses.pull(params.id);

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