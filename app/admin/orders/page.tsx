'use client';

import { useState, useEffect } from 'react';
import OrderTable from '@/components/admin/OrderTable';
import { IOrder } from '@/types';
import { useAuthStore } from '@/store/authStore';
import axios from 'axios';
import { Loader2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  });
  const [filter, setFilter] = useState('all');
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/admin/orders?status=${filter}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setOrders(response.data.data.orders);
        setStats(response.data.data.stats);
      }
    } catch (error: any) {
      console.error('Failed to fetch orders:', error);
      toast.error(error.response?.data?.error || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Orders Management</h1>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div
          onClick={() => setFilter('all')}
          className={`p-4 rounded-lg cursor-pointer transition ${
            filter === 'all' ? 'bg-blue-50 border-2 border-blue-500' : 'bg-white border'
          }`}
        >
          <p className="text-sm text-gray-600">Total Orders</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div
          onClick={() => setFilter('pending')}
          className={`p-4 rounded-lg cursor-pointer transition ${
            filter === 'pending' ? 'bg-yellow-50 border-2 border-yellow-500' : 'bg-white border'
          }`}
        >
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div
          onClick={() => setFilter('processing')}
          className={`p-4 rounded-lg cursor-pointer transition ${
            filter === 'processing' ? 'bg-blue-50 border-2 border-blue-500' : 'bg-white border'
          }`}
        >
          <p className="text-sm text-gray-600">Processing</p>
          <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
        </div>
        <div
          onClick={() => setFilter('shipped')}
          className={`p-4 rounded-lg cursor-pointer transition ${
            filter === 'shipped' ? 'bg-purple-50 border-2 border-purple-500' : 'bg-white border'
          }`}
        >
          <p className="text-sm text-gray-600">Shipped</p>
          <p className="text-2xl font-bold text-purple-600">{stats.shipped}</p>
        </div>
        <div
          onClick={() => setFilter('delivered')}
          className={`p-4 rounded-lg cursor-pointer transition ${
            filter === 'delivered' ? 'bg-green-50 border-2 border-green-500' : 'bg-white border'
          }`}
        >
          <p className="text-sm text-gray-600">Delivered</p>
          <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
        </div>
        <div
          onClick={() => setFilter('cancelled')}
          className={`p-4 rounded-lg cursor-pointer transition ${
            filter === 'cancelled' ? 'bg-red-50 border-2 border-red-500' : 'bg-white border'
          }`}
        >
          <p className="text-sm text-gray-600">Cancelled</p>
          <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
        </div>
      </div>

      {/* Orders Table */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <p className="text-gray-500 text-lg">No orders found</p>
          <p className="text-sm text-gray-400 mt-2">
            {filter !== 'all' ? `No ${filter} orders at the moment` : 'Orders will appear here once customers place them'}
          </p>
        </div>
      ) : (
        <OrderTable orders={orders} />
      )}
    </div>
  );
}