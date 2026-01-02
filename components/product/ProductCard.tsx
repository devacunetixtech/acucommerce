'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Star, Plus } from 'lucide-react';
import { IProduct } from '@/types';
import { formatPrice, calculateDiscount } from '@/lib/utils/helpers';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: IProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const finalPrice = product.discount > 0 
    ? calculateDiscount(product.price, product.discount) 
    : product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const variant = product.variants.find(v => v.stock > 0);
    
    if (!variant) {
      toast.error('Product out of stock');
      return;
    }

    addItem({
      productId: product._id,
      name: product.name,
      image: product.images[0],
      price: finalPrice,
      size: variant.size,
      color: variant.color,
      quantity: 1,
      stock: variant.stock,
    });

    toast.success('Added to cart!');
  };

  return (
    <div className="group relative bg-white rounded border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col h-full overflow-hidden">
      <Link href={`/products/${product._id}`} className="flex flex-col h-full">
        
        {/* Image Container */}
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
          />
          
          {/* Discount Badge */}
          {product.discount > 0 && (
            <div className="absolute top-2 right-2 bg-orange-100 text-[#F68B1E] px-2 py-1 rounded text-xs font-bold shadow-sm z-10">
              -{product.discount}%
            </div>
          )}

          {/* Wishlist Button */}
          <button 
            onClick={(e) => { e.preventDefault(); }}
            className="absolute top-2 left-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-[#F68B1E] hover:text-white text-gray-400 transition-colors z-10"
          >
            <Heart className="w-4 h-4" />
          </button>

          {/* --- MOBILE ADD TO CART (Visible Icon) --- */}
          <button
            onClick={handleAddToCart}
            className="md:hidden absolute bottom-2 right-2 p-2.5 bg-[#F68B1E] text-white rounded-full shadow-md active:scale-95 transition-transform z-10"
            aria-label="Add to cart"
          >
             <ShoppingCart className="w-5 h-5" />
          </button>

          {/* --- DESKTOP ADD TO CART (Slide Up) --- */}
          <div className="hidden md:block absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
             <button
                onClick={handleAddToCart}
                className="w-full bg-[#F68B1E] hover:bg-orange-600 text-white py-2.5 rounded shadow-md flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wide transition-colors"
             >
                <ShoppingCart className="w-4 h-4" />
                Add To Cart
             </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-3 flex flex-col flex-grow">
          <h3 className="text-sm text-gray-700 mb-1 line-clamp-2 min-h-[2.5rem] leading-relaxed group-hover:text-[#F68B1E] transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center justify-between mb-2">
             <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">{product.brand}</p>
             {product.averageRating > 0 && (
                <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-gray-500">({product.reviewCount})</span>
                </div>
             )}
          </div>

          <div className="mt-auto pt-2 border-t border-gray-50">
            <div className="flex flex-col">
                <span className="text-lg font-bold text-[#282828]">
                  {formatPrice(finalPrice)}
                </span>
                {product.discount > 0 && (
                  <span className="text-xs text-gray-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}