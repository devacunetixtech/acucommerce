'use client';

import Link from 'next/link';
import { formatPrice } from '@/lib/utils/helpers';

interface CartSummaryProps {
  subtotal: number;
  shipping?: number;
  tax?: number;
  discount?: number;
}

export default function CartSummary({ 
  subtotal, 
  shipping = 0, 
  tax = 0, 
  discount = 0 
}: CartSummaryProps) {
  const total = subtotal + shipping + tax - discount;

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        {shipping > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span>{formatPrice(shipping)}</span>
          </div>
        )}

        {tax > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>Tax</span>
            <span>{formatPrice(tax)}</span>
          </div>
        )}

        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}

        <div className="border-t pt-3 flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      <Link
        href="/checkout"
        className="block w-full bg-blue-600 text-white text-center py-3 rounded-md hover:bg-blue-700 transition font-semibold"
      >
        Proceed to Checkout
      </Link>

      <Link
        href="/products"
        className="block w-full text-center text-blue-600 py-2 mt-2 hover:underline"
      >
        Continue Shopping
      </Link>
    </div>
  );
}