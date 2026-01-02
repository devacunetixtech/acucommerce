'use client';

import { useForm } from 'react-hook-form';
import { Loader2, User, Mail, Phone, Save } from 'lucide-react';

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
}

interface ProfileFormProps {
  defaultValues: ProfileFormData;
  onSubmit: (data: ProfileFormData) => void;
  loading: boolean;
}

export default function ProfileForm({ defaultValues, onSubmit, loading }: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 md:p-8 rounded-lg shadow-sm border border-gray-100">
      
      {/* Header (Optional, if used standalone) */}
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-lg font-bold text-gray-800">Personal Details</h2>
        <p className="text-sm text-gray-500">Update your personal information.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('name', { required: 'Name is required' })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#F68B1E] focus:border-[#F68B1E] transition-colors placeholder-gray-400"
              placeholder="Enter your full name"
            />
          </div>
          {errors.name && (
            <p className="text-red-500 text-xs mt-1 font-medium">{errors.name.message}</p>
          )}
        </div>

        {/* Email (Read Only) */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              {...register('email')}
              disabled
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>
          <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
             To change your email, please contact support.
          </p>
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('phone', {
                pattern: {
                  value: /^[0-9+\-() ]+$/,
                  message: 'Invalid phone number',
                },
              })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#F68B1E] focus:border-[#F68B1E] transition-colors placeholder-gray-400"
              placeholder="+234..."
            />
          </div>
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone.message}</p>
          )}
        </div>
      </div>

      {/* Submit Action */}
      <div className="pt-4 border-t border-gray-100 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto px-8 py-3 bg-[#F68B1E] text-white rounded shadow-md hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-bold uppercase tracking-wide text-sm"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
}