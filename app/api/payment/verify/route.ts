import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import { successResponse, errorResponse } from '@/lib/utils/response';
import { requireAuth } from '@/lib/middleware/auth';
import { verifyPayment } from '@/lib/services/paystackService';

export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request);
    await connectDB();

    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');

    if (!reference) {
      return errorResponse('Reference is required', 400);
    }

    // Verify payment with Paystack
    const verification = await verifyPayment(reference);

    console.log('Paystack verification response:', JSON.stringify(verification, null, 2));

    // Paystack returns data nested under 'data' property
    const paymentData = verification.data;
    
    if (!paymentData || paymentData.status !== 'success') {
      return errorResponse('Payment was not successful', 400);
    }

    // Extract order ID from reference (format: {orderId}-{timestamp})
    const orderId = reference.split('-').slice(0, -1).join('-');
    
    console.log('Looking up order by ID:', orderId);
    const order = await Order.findById(orderId);

    if (!order) {
      return errorResponse('Order not found', 404);
    }

    // Check if payment was already verified (prevent double processing)
    if (order.paymentInfo.status === 'completed') {
      return successResponse(
        { order },
        'Payment already verified'
      );
    }

    // Update order with payment details
    order.paymentInfo.status = 'completed';
    order.paymentInfo.paystackReference = reference;
    order.paymentInfo.paystackAmount = paymentData.amount / 100; // Convert from kobo
    order.paymentInfo.paidAt = new Date();
    
    // Change order status from 'pending' to 'processing'
    order.status = 'processing';
    
    await order.save();

    console.log('Order updated successfully:', order.orderNumber);

    return successResponse(
      { order },
      'Payment verified successfully'
    );
  } catch (error: any) {
    console.error('Payment verification error:', error);
    
    if (error.message === 'Unauthorized') {
      return errorResponse(error.message, 401);
    }
    return errorResponse(error.message || 'Payment verification failed', 500);
  }
}