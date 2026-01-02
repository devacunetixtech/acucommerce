'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// Added Mail and Lock for better UI styling
import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import axios from 'axios';
import toast from 'react-hot-toast';

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/auth/login', data);

      if (response.data.success) {
        const { user, token } = response.data.data;
        setAuth(user, token);
        toast.success('Login successful!');
        
        // Redirect based on role
        if (user.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/');
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      
      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          E-mail Address
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
            // Updated styles: Jumia Orange Focus Ring, Padding for Icon
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#F68B1E] focus:border-[#F68B1E] placeholder-gray-400 transition-colors"
            placeholder="Enter your email"
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-xs text-red-500 font-medium">{errors.email.message}</p>
        )}
      </div>

      {/* Password Field */}
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
            // Updated styles: Jumia Orange Focus Ring, Padding for Icons
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#F68B1E] focus:border-[#F68B1E] placeholder-gray-400 transition-colors"
            placeholder="Enter your password"
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

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <label className="flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="h-4 w-4 rounded border-gray-300 text-[#F68B1E] focus:ring-[#F68B1E]" 
          />
          <span className="ml-2 text-sm text-gray-600 select-none">Remember me</span>
        </label>
        <Link 
            href="/forgot-password" 
            className="text-sm font-medium text-[#F68B1E] hover:text-orange-700 transition-colors"
        >
          Forgot password?
        </Link>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        // Updated styles: Uppercase, Bold, Jumia Orange Background, Shadow
        className="w-full bg-[#F68B1E] text-white py-3 px-4 rounded shadow-md hover:bg-orange-600 transition-all font-bold uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Signing in...
          </>
        ) : (
          'Login'
        )}
      </button>

      {/* Footer Link */}
      <div className="text-center text-sm text-gray-600 mt-6">
        Don't have an account?{' '}
        <Link 
            href="/register" 
            className="text-[#F68B1E] hover:text-orange-700 font-bold transition-colors"
        >
          Sign up
        </Link>
      </div>
    </form>
  );
}