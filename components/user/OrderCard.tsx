'use client';

import Link from 'next/link';
import Image from 'next/image';
import { IOrder } from '@/types';
import { formatPrice } from '@/lib/utils/helpers';
import { format } from 'date-fns';
import { Package, Truck, CheckCircle, XCircle, Clock, ChevronRight } from 'lucide-react';

interface OrderCardProps {
  order: IOrder;
}

export default function OrderCard({ order }: OrderCardProps) {
  
  // Helper for Status Styling (Consistent with Admin Table)
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          bg: 'bg-orange-50',
          text: 'text-orange-700',
          border: 'border-orange-200',
          icon: <Clock className="w-3.5 h-3.5 mr-1" />
        };
      case 'processing':
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          border: 'border-blue-200',
          icon: <Package className="w-3.5 h-3.5 mr-1" />
        };
      case 'shipped':
        return {
          bg: 'bg-purple-50',
          text: 'text-purple-700',
          border: 'border-purple-200',
          icon: <Truck className="w-3.5 h-3.5 mr-1" />
        };
      case 'delivered':
        return {
          bg: 'bg-green-50',
          text: 'text-green-700',
          border: 'border-green-200',
          icon: <CheckCircle className="w-3.5 h-3.5 mr-1" />
        };
      case 'cancelled':
        return {
          bg: 'bg-red-50',
          text: 'text-red-700',
          border: 'border-red-200',
          icon: <XCircle className="w-3.5 h-3.5 mr-1" />
        };
      default:
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-700',
          border: 'border-gray-200',
          icon: <Package className="w-3.5 h-3.5 mr-1" />
        };
    }
  };

  const statusStyle = getStatusStyle(order.status);

  return (
    <Link href={`/orders/${order._id}`} className="block group">  
      <div className="bg-white rounded-lg border border-gray-200 hover:border-[#F68B1E] hover:shadow-md transition-all duration-200 overflow-hidden">
        
        {/* Header: ID, Date, Status */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
               <span className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                 Order #{order.orderNumber}
               </span>
            </div>
            <p className="text-xs text-gray-500">
              Placed on {format(new Date(order.createdAt), 'MMM dd, yyyy')}
            </p>
          </div>
          
          <div className={`flex items-center px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wide ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
            {statusStyle.icon}
            {order.status}
          </div>
        </div>

        {/* Body: Items Preview */}
        <div className="p-6">
          <div className="flex flex-col gap-4">
            {order.items.slice(0, 2).map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                {/* Image Thumbnail */}
                <div className="relative w-16 h-16 flex-shrink-0 border border-gray-100 rounded bg-white">
                   <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-1"
                   />
                </div>
                
                {/* Item Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate pr-4">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Size: {item.size} <span className="mx-1">•</span> Qty: {item.quantity}
                  </p>
                  {/* Mobile Price Display */}
                  <p className="sm:hidden text-sm font-semibold text-[#F68B1E] mt-1">
                     ₦{formatPrice(item.price)}
                  </p>
                </div>

                {/* Desktop Item Price (Optional, mostly total matters) */}
                <div className="hidden sm:block text-right">
                   <p className="text-sm font-medium text-gray-600">₦{formatPrice(item.price)}</p>
                </div>
              </div>
            ))}

            {/* "+ More Items" Indicator */}
            {order.items.length > 2 && (
              <div className="pl-20 text-xs font-medium text-gray-500">
                + {order.items.length - 2} more item{order.items.length - 2 > 1 ? 's' : ''} in this order
              </div>
            )}
          </div>
        </div>

        {/* Footer: Total & CTA */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
           <div>
              <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Total Amount</p>
              <p className="text-xl font-bold text-[#F68B1E]">
                ₦{formatPrice(order.total)}
              </p>
           </div>
           
           <div className="flex items-center gap-1 text-sm font-bold text-blue-600 group-hover:text-[#F68B1E] transition-colors">
              See Details <ChevronRight className="w-4 h-4" />
           </div>
        </div>

        {/* Optional Tracking Info Strip */}
        {order.trackingNumber && (
            <div className="bg-blue-50 px-6 py-2 border-t border-blue-100 flex items-center gap-2">
                <Truck className="w-3 h-3 text-blue-600" />
                <p className="text-xs text-blue-700">
                    Tracking ID: <span className="font-mono font-bold">{order.trackingNumber}</span>
                </p>
            </div>
        )}

        </div>
    </Link>
  );
}