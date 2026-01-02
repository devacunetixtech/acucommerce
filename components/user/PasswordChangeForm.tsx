'use client';

import { useForm } from 'react-hook-form';
import { Loader2, Eye, EyeOff, Lock, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordChangeFormProps {
  onSubmit: (data: Omit<PasswordFormData, 'confirmPassword'>) => void;
  loading: boolean;
}

export default function PasswordChangeForm({ onSubmit, loading }: PasswordChangeFormProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>();

  const newPassword = watch('newPassword');

  const handleFormSubmit = (data: PasswordFormData) => {
    onSubmit({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-gray-100 h-full">
      
      {/* Header */}
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
           Change Password
        </h2>
        <p className="text-sm text-gray-500">Secure your account with a strong password.</p>
      </div>

      <div className="space-y-6">
        {/* Current Password */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Current Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              {...register('currentPassword', {
                required: 'Current password is required',
              })}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#F68B1E] focus:border-[#F68B1E] transition-colors placeholder-gray-400"
              placeholder="Enter current password"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#F68B1E] transition-colors"
            >
              {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-red-500 text-xs mt-1 font-medium">{errors.currentPassword.message}</p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            New Password
          </label>
          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showNewPassword ? 'text' : 'password'}
              {...register('newPassword', {
                required: 'New password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#F68B1E] focus:border-[#F68B1E] transition-colors placeholder-gray-400"
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#F68B1E] transition-colors"
            >
              {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-red-500 text-xs mt-1 font-medium">{errors.newPassword.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Confirm New Password
          </label>
          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === newPassword || 'Passwords do not match',
              })}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#F68B1E] focus:border-[#F68B1E] transition-colors placeholder-gray-400"
              placeholder="Confirm new password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#F68B1E] transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1 font-medium">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-8 pt-4 border-t border-gray-100">
        <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#F68B1E] text-white py-3 rounded shadow-md hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-bold uppercase tracking-wide text-sm"
        >
            {loading ? (
            <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Updating...
            </>
            ) : (
            <>
                <ShieldCheck className="w-4 h-4" />
                Change Password
            </>
            )}
        </button>
      </div>
    </form>
  );
}