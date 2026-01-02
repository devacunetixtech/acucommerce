'use client';

import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { ICartItem } from '@/types';
import { formatPrice } from '@/lib/utils/helpers';
import { useCartStore } from '@/store/cartStore';

interface CartItemProps {
  item: ICartItem;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > item.stock) {
      alert(`Only ${item.stock} items available in stock`);
      return;
    }
    updateQuantity(item.productId, item.size, item.color, newQuantity);
  };

  const handleRemove = () => {
    removeItem(item.productId, item.size, item.color);
  };

  return (
    <div className="flex gap-4 py-4 border-b">
      {/* Product Image */}
      <div className="relative w-24 h-24 flex-shrink-0">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover rounded-md"
        />
      </div>

      {/* Product Details */}
      <div className="flex-grow">
        <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
        <p className="text-sm text-gray-600">
          Size: {item.size} | Color: {item.color}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          {formatPrice(item.price)}
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center border rounded-md">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="p-2 hover:bg-gray-100"
              disabled={item.quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 py-2 border-x">{item.quantity}</span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="p-2 hover:bg-gray-100"
              disabled={item.quantity >= item.stock}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleRemove}
            className="p-2 text-red-600 hover:bg-red-50 rounded-md"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Total Price */}
      <div className="text-right">
        <p className="font-semibold text-lg">
          {formatPrice(item.price * item.quantity)}
        </p>
      </div>
    </div>
  );
}