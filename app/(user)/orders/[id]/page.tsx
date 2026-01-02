'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { IOrder } from '@/types';
import { formatPrice } from '@/lib/utils/helpers';
import { format } from 'date-fns';
import { useAuthStore } from '@/store/authStore';
import OrderStatusTimeline from '@/components/user/OrderStatusTimeline';
import axios from 'axios';
import { Loader2, ArrowLeft, MapPin, CreditCard } from 'lucide-react';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { token, isAuthenticated } = useAuthStore();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);

  // Wait for token to rehydrate before deciding to redirect or fetch
  useEffect(() => {
    // token === null -> still rehydrating (persisted store); do nothing yet
    if (token === null) return;

    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    fetchOrder();
  }, [token]);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`/api/orders/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setOrder(response.data.data);
      }
    } catch (error) {
      const axiosError = error as any;
      console.error('Failed to fetch order:', error, axiosError?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Order not found</h2>
        <button
          onClick={() => router.push('/orders')}
          className="text-blue-600 hover:underline"
        >
          Back to orders
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Header */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold mb-2">Order #{order.orderNumber}</h1>
                <p className="text-gray-600">
                  Placed on {format(new Date(order.createdAt), 'MMMM dd, yyyy')}
                </p>
              </div>
              <span className={`px-4 py-2 rounded-full capitalize font-semibold ${
                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {order.status}
              </span>
            </div>

            {/* Payment Status Badge */}
            {order.paymentInfo.status === 'completed' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  Payment Completed - {order.paymentInfo.paidAt 
                    ? format(new Date(order.paymentInfo.paidAt), 'MMM dd, yyyy HH:mm')
                    : 'Recently'
                  }
                </span>
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-4 pb-4 border-b last:border-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      Size: {item.size} | Color: {item.color}
                    </p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                    <p className="text-sm text-gray-600">{formatPrice(item.price)} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold mb-3 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Shipping Address
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.phone}</p>
              <p>{order.shippingAddress.street}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Order Status Timeline */}
          <OrderStatusTimeline 
            status={order.status} 
            paymentStatus={order.paymentInfo.status}
          />

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>{formatPrice(order.shippingCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>{formatPrice(order.tax)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {order.trackingNumber && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="font-semibold text-blue-900 mb-2">Tracking Number</p>
              <p className="font-mono text-lg text-blue-800">{order.trackingNumber}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}