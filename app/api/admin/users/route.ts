import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { successResponse, errorResponse } from '@/lib/utils/response';
import { requireAdmin } from '@/lib/middleware/auth';
// GET all users
export async function GET(request: NextRequest) {
    try {
    requireAdmin(request);
    await connectDB();
    const { searchParams } = new URL(request.url);
const page = parseInt(searchParams.get('page') || '1');
const limit = parseInt(searchParams.get('limit') || '20');
const search = searchParams.get('search');
const skip = (page - 1) * limit;

let query: any = {};

if (search) {
  query.$or = [
    { name: { $regex: search, $options: 'i' } },
    { email: { $regex: search, $options: 'i' } },
  ];
}

const users = await User.find(query)
  .select('-password')
  .skip(skip)
  .limit(limit)
  .sort({ createdAt: -1 });

const total = await User.countDocuments(query);

return successResponse({
  users,
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
return errorResponse(error.message || 'Failed to fetch users', 500);
}
}