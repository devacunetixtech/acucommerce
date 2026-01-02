'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import axios from 'axios';
import { Loader2, CheckCircle, XCircle, Package } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils/helpers';

export default function VerifyPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token } = useAuthStore();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [order, setOrder] = useState<any>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    try {
      const reference = searchParams.get('reference');
      const trxref = searchParams.get('trxref'); // Paystack also sends trxref

      const paymentReference = reference || trxref;

      if (!paymentReference) {
        setMessage('No payment reference found');
        setStatus('failed');
        return;
      }

      // Show user-friendly message while verifying
      setMessage('Verifying your payment with Paystack...');

      // Verify payment with backend
      const response = await axios.get(
        `/api/payment/verify?reference=${paymentReference}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setOrder(response.data.data.order);
        setStatus('success');
        setMessage('Payment successful!');
        
        // Clean up localStorage
        localStorage.removeItem('pendingOrderId');
        localStorage.removeItem('pendingOrderNumber');
        
        // Auto redirect to orders page after 3 seconds
        setTimeout(() => {
          router.push('/orders');
        }, 15000);
      } else {
        setStatus('failed');
        setMessage(response.data.message || 'Payment verification failed');
      }
    } catch (error: any) {
      console.error('Payment verification error:', error);
      setStatus('failed');
      setMessage(
        error.response?.data?.error || 
        'Unable to verify payment. Please contact support if amount was deducted.'
      );
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Processing Payment</h2>
          <p className="text-gray-600">{message}</p>
          <p className="text-sm text-gray-500 mt-4">Please wait, do not close this page...</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
          {/* Success Icon */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-600">
              Thank you for your purchase. Your order has been confirmed.
            </p>
          </div>

          {/* Order Details */}
          {order && (
            <div className="border-t border-b py-6 my-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Order Number</p>
                  <p className="text-xl font-bold text-gray-900">
                    {order.orderNumber}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Paid</p>
                  <p className="text-xl font-bold text-green-600">
                    ₦{formatPrice(order.total)}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Shipping To:</p>
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p className="text-sm text-gray-600">
                  {order.shippingAddress.street}, {order.shippingAddress.city}
                </p>
                <p className="text-sm text-gray-600">
                  {order.shippingAddress.state}, {order.shippingAddress.zipCode}
                </p>
              </div>
            </div>
          )}

          {/* What's Next */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
              <Package className="w-5 h-5 mr-2" />
              What happens next?
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✓ Order confirmation email sent</li>
              <li>✓ Your items are being prepared for shipping</li>
              <li>✓ You'll receive tracking information soon</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={`/orders/${order?._id}`}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 text-center font-semibold"
            >
              View Order Details
            </Link>
            <Link
              href="/products"
              className="flex-1 border border-gray-300 px-6 py-3 rounded-md hover:bg-gray-50 text-center font-semibold"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        {/* Error Icon */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Failed
          </h1>
          <p className="text-gray-600 mb-4">{message}</p>
        </div>

        {/* Support Info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> If money was deducted from your account, it will be automatically refunded within 24-48 hours.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Link
            href="/checkout"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 text-center font-semibold"
          >
            Try Again
          </Link>
          <Link
            href="/cart"
            className="border border-gray-300 px-6 py-3 rounded-md hover:bg-gray-50 text-center"
          >
            Back to Cart
          </Link>
          <Link
            href="/orders"
            className="text-gray-600 hover:text-gray-900 text-center text-sm"
          >
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
