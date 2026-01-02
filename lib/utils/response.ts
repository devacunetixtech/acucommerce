import { NextResponse } from 'next/server';
import { ApiResponse } from '@/types';

export const successResponse = <T>(data: T, message?: string, status: number = 200): NextResponse<ApiResponse<T>> => {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    },
    { status }
  );
};

export const errorResponse = (error: string, status: number = 400): NextResponse<ApiResponse> => {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status }
  );
};