'use client';

import { ICartItem } from '@/types';
import { formatPrice } from '@/lib/utils/helpers';

interface OrderSummaryProps {
  items: ICartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export default function OrderSummary({
  items,
  subtotal,
  shipping,
  tax,
  total,
}: OrderSummaryProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

      {/* Items */}
      <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
        {items.map((item, index) => (
          <div key={index} className="flex gap-3">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <p className="font-medium text-sm">{item.name}</p>
              <p className="text-xs text-gray-600">
                {item.size} | {item.color} | Qty: {item.quantity}
              </p>
              <p className="text-sm font-semibold mt-1">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="space-y-2 pt-4 border-t">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>₦{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span>₦{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Tax (7.5%)</span>
          <span>₦{formatPrice(tax)}</span>
        </div>

        <div className="flex justify-between font-bold text-lg pt-2 border-t">
          <span>Total</span>
          <span>₦{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}