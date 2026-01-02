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
    // Changed to a white card with shadow for separation
    <div className="flex flex-col sm:flex-row gap-4 py-6 px-4 bg-white border border-gray-100 rounded-lg shadow-sm mb-4 transition-shadow hover:shadow-md">
      
      {/* Product Image */}
      <div className="relative w-full sm:w-32 h-32 flex-shrink-0">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-contain rounded-md bg-gray-50"
        />
      </div>

      {/* Product Details & Controls */}
      <div className="flex-grow flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-[#282828] line-clamp-2 leading-snug">
              {item.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Size: <span className="font-medium text-gray-800">{item.size}</span> | Color: <span className="font-medium text-gray-800">{item.color}</span>
            </p>
            {item.stock < 5 && (
               <p className="text-xs text-[#F68B1E] mt-1">Few units left!</p>
            )}
          </div>
          
          {/* Price (Desktop Position) */}
          <div className="hidden sm:block text-right">
             <p className="font-bold text-xl text-[#F68B1E]">
               {formatPrice(item.price * item.quantity)}
             </p>
             {item.quantity > 1 && (
               <p className="text-xs text-gray-400">
                 {formatPrice(item.price)} x {item.quantity}
               </p>
             )}
          </div>
        </div>

        {/* Action Row */}
        <div className="flex justify-between items-center mt-4">
          
          {/* Remove Button (Jumia Style: Text + Icon) */}
          <button
            onClick={handleRemove}
            className="flex items-center gap-2 text-[#F68B1E] hover:text-orange-700 transition-colors group"
          >
            <div className="p-1.5 rounded bg-orange-50 group-hover:bg-orange-100">
                <Trash2 className="w-4 h-4" />
            </div>
            <span className="text-sm font-semibold uppercase tracking-wide">Remove</span>
          </button>

          {/* Quantity Controls (Boxed Style) */}
          <div className="flex items-center shadow-sm rounded overflow-hidden">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="p-2 bg-[#F68B1E] text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-8 h-8 flex items-center justify-center"
              disabled={item.quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </button>
            <div className="px-4 py-1 text-sm font-semibold text-gray-900 bg-white border-y border-gray-200 min-w-[2.5rem] text-center">
                {item.quantity}
            </div>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="p-2 bg-[#F68B1E] text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-8 h-8 flex items-center justify-center"
              disabled={item.quantity >= item.stock}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Price (Mobile Position) */}
        <div className="sm:hidden mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
            <span className="text-sm text-gray-500">Subtotal:</span>
            <p className="font-bold text-lg text-[#F68B1E]">
                {formatPrice(item.price * item.quantity)}
            </p>
        </div>
      </div>
    </div>
  );
}