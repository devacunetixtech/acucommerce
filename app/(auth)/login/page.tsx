import React from 'react';
import LoginForm from '@/components/auth/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    // changed: background to a clean, flat gray for high contrast
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F3F4F6] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Brand Logo - Placed outside the card for a clean header look (Jumia style) */}
      <div className="mb-8 text-center">
         <Link href="/" className="flex items-center justify-center gap-2 group">
            {/* Simple Star Icon representation for branding */}
            <div className="bg-[#F68B1E] text-white p-1 rounded shadow-sm group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <span className="text-3xl font-bold text-[#282828] tracking-tight">
              Fashion<span className="text-[#F68B1E]">Store</span>
            </span>
         </Link>
      </div>

      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-md p-8 sm:p-10 border-t-4 border-[#F68B1E]">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#282828]">
              Welcome back!
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Log in to access your orders and wishlist.
            </p>
          </div>

          {/* Login Form Component */}
          {/* Note: Ensure your LoginForm inputs utilize 'focus:ring-[#F68B1E]' to match the theme */}
          <div className="space-y-6">
             <LoginForm />
          </div>

          {/* Social Login Separator */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">Or login with</span>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <button className="w-full flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded hover:bg-gray-50 transition-colors duration-200 shadow-sm group">
                <svg className="w-5 h-5 text-gray-700 group-hover:text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" />
                </svg>
                <span className="ml-2 text-sm font-medium text-gray-700">Github</span>
              </button>
              
              <button className="w-full flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded hover:bg-gray-50 transition-colors duration-200 shadow-sm group">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 0C4.477 0 0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.879V12.89h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.989C16.343 19.128 20 14.991 20 10c0-5.523-4.477-10-10-10z" />
                </svg>
                <span className="ml-2 text-sm font-medium text-gray-700">Facebook</span>
              </button>
            </div>
          </div>
          
          {/* Register Link Footer */}
          <div className="mt-8 text-center text-sm">
             <span className="text-gray-500">New to FashionStore? </span>
             <Link href="/register" className="font-semibold text-[#F68B1E] hover:text-orange-600 transition-colors">
                Create an account
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}