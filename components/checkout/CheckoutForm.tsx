'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { IAddress } from '@/types';
import { Loader2 } from 'lucide-react';

interface CheckoutFormData {
  fullName: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => void;
  loading: boolean;
  savedAddresses?: IAddress[];
  defaultValues?: Partial<CheckoutFormData>;
}

export default function CheckoutForm({ 
  onSubmit, 
  loading, 
  savedAddresses = [],
  defaultValues 
}: CheckoutFormProps) {
  const [useExisting, setUseExisting] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<string>('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    defaultValues: defaultValues || {
      country: 'Nigeria',
    },
  });

  const handleAddressSelect = (address: IAddress) => {
    reset({
      fullName: address.fullName,
      phone: address.phone,
      email: defaultValues?.email || '',
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
    });
    setSelectedAddress(address._id || '');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Use Saved Address */}
      {savedAddresses.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <label className="flex items-center mb-3">
            <input
              type="checkbox"
              checked={useExisting}
              onChange={(e) => setUseExisting(e.target.checked)}
              className="mr-2"
            />
            <span className="font-medium">Use saved address</span>
          </label>

          {useExisting && (
            <div className="space-y-2">
              {savedAddresses.map((address) => (
                <button
                  key={address._id}
                  type="button"
                  onClick={() => handleAddressSelect(address)}
                  className={`w-full text-left p-3 border rounded-md ${
                    selectedAddress === address._id
                      ? 'border-blue-600 bg-blue-100'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  <p className="font-medium">{address.fullName}</p>
                  <p className="text-sm text-gray-600">
                    {address.street}, {address.city}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Contact Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name *</label>
            <input
              {...register('fullName', { required: 'Full name is required' })}
              className="w-full p-3 border rounded-md"
              placeholder="John Doe"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full p-3 border rounded-md"
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone *</label>
          <input
            {...register('phone', { required: 'Phone is required' })}
            className="w-full p-3 border rounded-md"
            placeholder="+234 800 000 0000"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>
      </div>

      {/* Shipping Address */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Shipping Address</h3>

        <div>
          <label className="block text-sm font-medium mb-1">Street Address *</label>
          <input
            {...register('street', { required: 'Street address is required' })}
            className="w-full p-3 border rounded-md"
            placeholder="123 Main Street"
          />
          {errors.street && (
            <p className="text-red-500 text-sm mt-1">{errors.street.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">City *</label>
            <input
              {...register('city', { required: 'City is required' })}
              className="w-full p-3 border rounded-md"
              placeholder="Lagos"
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">State *</label>
            <input
              {...register('state', { required: 'State is required' })}
              className="w-full p-3 border rounded-md"
              placeholder="Lagos"
            />
            {errors.state && (
              <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Zip Code *</label>
            <input
              {...register('zipCode', { required: 'Zip code is required' })}
              className="w-full p-3 border rounded-md"
              placeholder="100001"
            />
            {errors.zipCode && (
              <p className="text-red-500 text-sm mt-1">{errors.zipCode.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Country *</label>
            <input
              {...register('country', { required: 'Country is required' })}
              className="w-full p-3 border rounded-md"
              placeholder="Nigeria"
            />
            {errors.country && (
              <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
            )}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-4 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center font-semibold text-lg"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Processing...
          </>
        ) : (
          'Continue to Payment'
        )}
      </button>
    </form>
  );
}