'use client';

import Link from 'next/link';
import { formatPrice } from '@/lib/utils/helpers';
import { ArrowRight, ShieldCheck } from 'lucide-react';

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
    <div className="bg-white rounded shadow-md border border-gray-100 sticky top-24">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-sm font-bold uppercase text-gray-500 tracking-wider">Cart Summary</h2>
      </div>

      <div className="p-4 space-y-4">
        {/* Subtotal Row */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
          <span className="text-gray-600 text-sm">Subtotal</span>
          <span className="font-bold text-gray-900 text-lg">{formatPrice(subtotal)}</span>
        </div>

        {/* Additional Costs */}
        <div className="space-y-2">
            {shipping > 0 ? (
            <div className="flex justify-between text-sm text-gray-500">
                <span>Shipping</span>
                <span>{formatPrice(shipping)}</span>
            </div>
            ) : (
             <div className="flex justify-between text-sm text-gray-500">
                <span>Shipping</span>
                <span className="text-green-600 font-medium text-xs uppercase">Free</span>
             </div>
            )}

            {tax > 0 && (
            <div className="flex justify-between text-sm text-gray-500">
                <span>Tax</span>
                <span>{formatPrice(tax)}</span>
            </div>
            )}

            {discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span>-{formatPrice(discount)}</span>
            </div>
            )}
        </div>

        {/* Total Row */}
        <div className="flex justify-between items-end pt-2 border-t border-gray-200">
          <span className="font-bold text-gray-900">Total</span>
          <div className="text-right">
             <span className="block text-2xl font-bold text-[#F68B1E] leading-none">
               {formatPrice(total)}
             </span>
             <span className="text-xs text-gray-400 font-medium">Inclusive of taxes</span>
          </div>
        </div>

        {/* Checkout Button */}
        <Link
          href="/checkout"
          className="group block w-full bg-[#F68B1E] text-white text-center py-3.5 rounded shadow-md hover:bg-orange-600 hover:shadow-lg transition-all duration-200 font-bold uppercase text-sm tracking-wide flex items-center justify-center gap-2"
        >
          Checkout
          {/* Animated Arrow on Hover */}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
        
        {/* Trust Badge (Common in Jumia/Ecommerce carts) */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-2">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            <span>Secure Checkout</span>
        </div>
      </div>

      {/* Continue Shopping Link (Footer of Card) */}
      <div className="bg-gray-50 p-4 rounded-b border-t border-gray-100 text-center">
        <Link
          href="/products"
          className="text-[#F68B1E] text-sm font-semibold hover:text-orange-700 hover:underline transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}