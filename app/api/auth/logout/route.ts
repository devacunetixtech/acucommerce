import { NextRequest } from 'next/server';
import { successResponse } from '@/lib/utils/response';

export async function POST(request: NextRequest) {
  // In a JWT-based auth system, logout is typically handled client-side
  // by removing the token from storage.
  // This endpoint can be used for logging/analytics purposes.

  return successResponse(null, 'Logged out successfully');
}