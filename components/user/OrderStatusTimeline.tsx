'use client';

import { CheckCircle, Package, Truck, Home, Clock, XCircle } from 'lucide-react';

interface OrderStatusTimelineProps {
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
}

export default function OrderStatusTimeline({ status, paymentStatus }: OrderStatusTimelineProps) {
  const steps = [
    { 
      key: 'pending', 
      label: 'Order Placed', 
      icon: Clock,
      description: 'Order received'
    },
    { 
      key: 'processing', 
      label: 'Processing', 
      icon: Package,
      description: 'Payment confirmed, preparing items'
    },
    { 
      key: 'shipped', 
      label: 'Shipped', 
      icon: Truck,
      description: 'On the way to you'
    },
    { 
      key: 'delivered', 
      label: 'Delivered', 
      icon: Home,
      description: 'Order completed'
    },
  ];

  const statusIndex = steps.findIndex(step => step.key === status);
  const isCancelled = status === 'cancelled';

  if (isCancelled) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3 text-red-800">
          <XCircle className="w-8 h-8" />
          <div>
            <h3 className="font-semibold text-lg">Order Cancelled</h3>
            <p className="text-sm">This order has been cancelled</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6">
      <h3 className="font-semibold text-lg mb-6">Order Status</h3>
      
      {/* Payment Status Alert */}
      {paymentStatus === 'completed' && status === 'processing' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-green-900">Payment Successful</p>
              <p className="text-sm text-green-700">
                Your payment has been confirmed. We're preparing your order for shipment.
              </p>
            </div>
          </div>
        </div>
      )}

      {paymentStatus === 'pending' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-900">Payment Pending</p>
              <p className="text-sm text-yellow-700">
                Waiting for payment confirmation
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="relative">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index <= statusIndex;
          const isCurrent = index === statusIndex;

          return (
            <div key={step.key} className="relative pb-8 last:pb-0">
              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute left-4 top-8 w-0.5 h-full ${
                    isCompleted ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              )}

              {/* Step */}
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full ${
                    isCompleted
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pt-0.5">
                  <p
                    className={`font-semibold ${
                      isCurrent ? 'text-blue-600' : isCompleted ? 'text-gray-900' : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-sm text-gray-600">{step.description}</p>
                  {isCurrent && (
                    <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      Current Status
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}