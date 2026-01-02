import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/utils/response';
import { requireAuth } from '@/lib/middleware/auth';
import { initializePayment } from '@/lib/services/paystackService';

export async function POST(request: NextRequest) {
  try {
    const user = requireAuth(request);

    const { email, amount, orderId, orderNumber } = await request.json();

    if (!email || !amount || !orderId || !orderNumber) {
      return errorResponse('Email, amount, orderId, and orderNumber are required', 400);
    }

    // Use order ID as reference (more reliable than order number)
    const reference = `${orderId}-${Date.now()}`;

    // Construct the clean callback URL (Paystack will append the transaction reference)
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/checkout/verify`;

    const paymentData = await initializePayment(
      email,
      amount,
      callbackUrl,
      reference,
      { orderId, userId: user.id, orderNumber }
    );

    return successResponse({
      authorization_url: paymentData.data.authorization_url,
      access_code: paymentData.data.access_code,
      reference: paymentData.data.reference,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return errorResponse(error.message, 401);
    }
    console.error('Payment initialization error:', error);
    return errorResponse(error.message || 'Payment initialization failed', 500);
  }
}