'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Loader2, ShoppingBag } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const { user, token, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);

  const subtotal = getTotal();
  const shipping = subtotal > 50000 ? 0 : 2500;
  const tax = subtotal * 0.075;
  const total = subtotal + shipping + tax;

  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error('Please login to checkout');
      router.push('/login');
      return;
    }

    if (items.length === 0) {
      router.push('/cart');
      return;
    }

    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await axios.get('/api/users/addresses', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setAddresses(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    }
  };

  const handleCheckout = async (formData: any) => {
    try {
      setLoading(true);

      // Step 1: Create order
      const orderResponse = await axios.post(
        '/api/orders',
        {
          items,
          shippingAddress: {
            fullName: formData.fullName,
            phone: formData.phone,
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
          },
          paymentMethod: 'paystack',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!orderResponse.data.success) {
        throw new Error('Failed to create order');
      }

      const order = orderResponse.data.data;

      // Step 2: Initialize Paystack payment
      const paymentResponse = await axios.post(
        '/api/payment/initialize',
        {
          email: formData.email,
          amount: total,
          orderId: order._id,
          orderNumber: order.orderNumber,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (paymentResponse.data.success) {
        // Step 3: Store order info in localStorage for verification
        localStorage.setItem('pendingOrderId', order._id);
        localStorage.setItem('pendingOrderNumber', order.orderNumber);
        
        // Clear cart before redirecting
        // clearCart();

        // Step 4: Redirect to Paystack payment page
        window.location.href = paymentResponse.data.data.authorization_url;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Checkout failed');
      console.error('Checkout error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <button
          onClick={() => router.push('/products')}
          className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <CheckoutForm
              onSubmit={handleCheckout}
              loading={loading}
              savedAddresses={addresses}
              defaultValues={{
                email: user?.email || '',
              }}
            />
          </div>

          {/* Payment Info */}
          <div className="bg-blue-50 rounded-lg p-4 mt-6">
            <p className="text-sm text-blue-900">
              🔒 <strong>Secure Payment</strong> - You will be redirected to Paystack to complete your payment securely.
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <OrderSummary
            items={items}
            subtotal={subtotal}
            shipping={shipping}
            tax={tax}
            total={total}
          />
        </div>
      </div>
    </div>
  );
}