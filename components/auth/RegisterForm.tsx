'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// Added User, Mail, Lock icons
import { Eye, EyeOff, Loader2, User, Mail, Lock } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import axios from 'axios';
import toast from 'react-hot-toast';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterForm() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      const { confirmPassword, ...registerData } = data;

      const response = await axios.post('/api/auth/register', registerData);

      if (response.data.success) {
        const { user, token } = response.data.data;
        setAuth(user, token);
        toast.success('Registration successful!');
        router.push('/');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      
      {/* Name Input */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="name"
            type="text"
            {...register('name', {
              required: 'Name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters',
              },
            })}
            // Jumia Style: Sharp corners (rounded), Orange focus ring
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#F68B1E] focus:border-[#F68B1E] placeholder-gray-400"
            placeholder="Enter your full name"
          />
        </div>
        {errors.name && (
          <p className="mt-1 text-xs text-red-500 font-medium">{errors.name.message}</p>
        )}
      </div>

      {/* Email Input */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="email"
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#F68B1E] focus:border-[#F68B1E] placeholder-gray-400"
            placeholder="Enter your email"
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-xs text-red-500 font-medium">{errors.email.message}</p>
        )}
      </div>

      {/* Password Input */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#F68B1E] focus:border-[#F68B1E] placeholder-gray-400"
            placeholder="Create a password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#F68B1E] transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-xs text-red-500 font-medium">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password Input */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) => value === password || 'Passwords do not match',
            })}
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#F68B1E] focus:border-[#F68B1E] placeholder-gray-400"
            placeholder="Confirm your password"
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
          <p className="mt-1 text-xs text-red-500 font-medium">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Terms Checkbox */}
      <div className="flex items-start mt-2">
        <div className="flex items-center h-5">
          <input
            type="checkbox"
            required
            className="h-4 w-4 rounded border-gray-300 text-[#F68B1E] focus:ring-[#F68B1E] cursor-pointer"
          />
        </div>
        <div className="ml-2 text-sm">
          <span className="text-gray-600">I agree to the </span>
          <Link href="/terms" className="text-[#F68B1E] hover:text-orange-700 font-medium transition-colors">
            Terms of Service
          </Link>
          <span className="text-gray-600"> and </span>
          <Link href="/privacy" className="text-[#F68B1E] hover:text-orange-700 font-medium transition-colors">
            Privacy Policy
          </Link>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        // Jumia Style: Uppercase, Bold, Shadow, Orange
        className="w-full bg-[#F68B1E] text-white py-3 rounded shadow-md hover:bg-orange-600 transition-all font-bold uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Creating account...
          </>
        ) : (
          'Create Account'
        )}
      </button>

      {/* Login Link */}
      <div className="text-center text-sm text-gray-600 mt-6">
        Already have an account?{' '}
        <Link 
            href="/login" 
            className="text-[#F68B1E] hover:text-orange-700 font-bold transition-colors"
        >
          Sign in
        </Link>
      </div>
    </form>
  );
}