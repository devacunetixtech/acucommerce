'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OrderCard from '@/components/user/OrderCard'; // Make sure path is correct
import { IOrder } from '@/types';
import { useAuthStore } from '@/store/authStore';
import axios from 'axios';
import { Loader2, Package, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
  const router = useRouter();
  const { token, isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setOrders(response.data.data.orders);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[#F68B1E]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] pb-12">
      {/* Header */}
      <div className="bg-[#282828] text-white py-8 mb-6">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <Package className="w-6 h-6 text-[#F68B1E]" />
                My Orders
            </h1>
            <p className="text-gray-400 text-sm mt-1 ml-8">Track your delivery status and order history.</p>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 text-center">
            <div className="bg-orange-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-10 h-10 text-[#F68B1E]" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">You have placed no orders yet!</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
                All your orders will be saved here for you to access their state anytime.
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-[#F68B1E] text-white px-8 py-3 rounded shadow-md hover:bg-orange-600 font-bold uppercase tracking-wide transition-all inline-flex items-center gap-2"
            >
              Start Shopping
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}