'use client';

import { useForm } from 'react-hook-form';
import { IAddress } from '@/types';
import { X, Loader2, User, Phone, MapPin, Building, Flag, Globe, Save } from 'lucide-react';

interface AddressFormProps {
  address?: IAddress & { _id?: string };
  onSubmit: (data: any) => void;
  onCancel: () => void;
  loading: boolean;
}

export default function AddressForm({ address, onSubmit, onCancel, loading }: AddressFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: address || {
      fullName: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Nigeria',
      isDefault: false,
    },
  });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
          <div>
            <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide">
              {address?._id ? 'Edit Address' : 'Add New Address'}
            </h2>
            <p className="text-xs text-gray-500">Please provide accurate shipping details.</p>
          </div>
          <button 
            onClick={onCancel} 
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
            <form id="address-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Row 1: Contact Info */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-[#F68B1E] uppercase tracking-wider mb-2 border-b border-gray-100 pb-1">
                    Contact Information
                </h3>
                
                {/* Full Name */}
                <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Full Name</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                        {...register('fullName', { required: 'Full name is required' })}
                        className="w-full pl-9 p-2.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#F68B1E] focus:border-[#F68B1E] placeholder-gray-400 transition-colors"
                        placeholder="e.g. John Doe"
                        />
                    </div>
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message as string}</p>}
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Phone Number</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                        {...register('phone', { required: 'Phone is required' })}
                        className="w-full pl-9 p-2.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#F68B1E] focus:border-[#F68B1E] placeholder-gray-400 transition-colors"
                        placeholder="e.g. +234 800 000 0000"
                        />
                    </div>
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message as string}</p>}
                </div>
            </div>

            {/* Row 2: Location Info */}
            <div className="space-y-4 pt-2">
                <h3 className="text-xs font-bold text-[#F68B1E] uppercase tracking-wider mb-2 border-b border-gray-100 pb-1">
                    Delivery Address
                </h3>

                {/* Street Address */}
                <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Street Address</label>
                    <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin className="h-4 w-4 text-gray-400" />
                        </div>
                        <textarea
                        {...register('street', { required: 'Street address is required' })}
                        className="w-full pl-9 p-2.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#F68B1E] focus:border-[#F68B1E] placeholder-gray-400 transition-colors resize-none"
                        placeholder="e.g. 123 Main Street, Apt 4B"
                        rows={2}
                        />
                    </div>
                    {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street.message as string}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* City */}
                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">City</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Building className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                            {...register('city', { required: 'City is required' })}
                            className="w-full pl-9 p-2.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#F68B1E] focus:border-[#F68B1E] placeholder-gray-400 transition-colors"
                            placeholder="e.g. Lagos"
                            />
                        </div>
                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message as string}</p>}
                    </div>

                    {/* State */}
                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">State</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Building className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                            {...register('state', { required: 'State is required' })}
                            className="w-full pl-9 p-2.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#F68B1E] focus:border-[#F68B1E] placeholder-gray-400 transition-colors"
                            placeholder="e.g. Lagos"
                            />
                        </div>
                        {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message as string}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Zip Code */}
                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Zip Code</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Flag className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                            {...register('zipCode', { required: 'Zip code is required' })}
                            className="w-full pl-9 p-2.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#F68B1E] focus:border-[#F68B1E] placeholder-gray-400 transition-colors"
                            placeholder="100001"
                            />
                        </div>
                        {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode.message as string}</p>}
                    </div>

                    {/* Country */}
                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase">Country</label>
                         <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Globe className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                            {...register('country', { required: 'Country is required' })}
                            className="w-full pl-9 p-2.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#F68B1E] focus:border-[#F68B1E] placeholder-gray-400 transition-colors bg-gray-50 cursor-not-allowed"
                            placeholder="Nigeria"
                            readOnly
                            />
                        </div>
                        {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country.message as string}</p>}
                    </div>
                </div>
            </div>

            {/* Default Checkbox */}
            <div className="flex items-center gap-2 p-3 bg-orange-50 rounded border border-orange-100">
                <input
                type="checkbox"
                id="isDefault"
                {...register('isDefault')}
                className="w-4 h-4 text-[#F68B1E] border-gray-300 rounded focus:ring-[#F68B1E] accent-[#F68B1E] cursor-pointer"
                />
                <label htmlFor="isDefault" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                   Set as my default shipping address
                </label>
            </div>
            </form>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-gray-100 bg-gray-50 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-bold uppercase text-sm rounded hover:bg-white hover:shadow-sm transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="address-form"
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-[#F68B1E] text-white font-bold uppercase text-sm rounded shadow-md hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Address
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}