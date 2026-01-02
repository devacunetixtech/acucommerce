'use client';

import Link from 'next/link';
import { ShoppingCart, User, Search, Menu, LogOut, Package, Settings as SettingsIcon, ChevronDown, HelpCircle, X } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const itemCount = useCartStore((state) => state.getItemCount());
  const { user, isAuthenticated, logout } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMobileMenu]);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    setShowMobileMenu(false);
    router.push('/');
  };

  const closeMobileMenu = () => {
    setShowMobileMenu(false);
  };

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-50 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20 gap-2 md:gap-4">
            
            {/* 1. Brand Logo */}
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="bg-[#F68B1E] text-white p-1 rounded-sm shadow-sm group-hover:scale-105 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <span className="text-xl md:text-2xl font-bold text-[#282828] hidden sm:block">
                Fashion<span className="text-[#F68B1E]">Store</span>
              </span>
            </Link>

            {/* 2. Search Bar (Desktop) */}
            <div className="flex-1 max-w-2xl hidden md:flex items-center">
              <div className="relative w-full flex">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-l-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#F68B1E] focus:border-[#F68B1E] sm:text-sm"
                  placeholder="Search products, brands and categories..."
                />
                <button className="bg-[#F68B1E] hover:bg-orange-600 text-white px-6 py-2 rounded-r-md text-sm font-bold uppercase shadow-sm transition-colors">
                  Search
                </button>
              </div>
            </div>

            {/* 3. Navigation Links (Desktop) */}
            <div className="hidden lg:flex items-center space-x-6 text-sm font-medium text-gray-700">
              <Link href="/products?category=shoes" className="hover:text-[#F68B1E] transition-colors">
                Shoes
              </Link>
              <Link href="/products?category=bags" className="hover:text-[#F68B1E] transition-colors">
                Bags
              </Link>
              <Link href="/products?category=clothes" className="hover:text-[#F68B1E] transition-colors">
                Clothes
              </Link>
            </div>

            {/* 4. Right Icons */}
            <div className="flex items-center space-x-1 md:space-x-2">
              
              {/* Mobile Search Toggle */}
              <button 
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-full"
              >
                <Search className="w-5 h-5 text-gray-700" />
              </button>

              {/* Account Dropdown (Desktop) */}
              {isAuthenticated() ? (
                <div className="hidden md:block relative" ref={menuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded-md transition-colors"
                  >
                    <User className="w-6 h-6 text-gray-700" />
                    <div className="flex flex-col items-start ml-1">
                      <span className="text-xs text-gray-500">Hello,</span>
                      <span className="text-sm font-bold text-gray-900 leading-none flex items-center gap-1">
                        {user?.name?.split(' ')[0]} <ChevronDown className="w-3 h-3" />
                      </span>
                    </div>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded shadow-xl py-1 border border-gray-100 ring-1 ring-black ring-opacity-5 origin-top-right transform transition-all duration-200 z-50">
                      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                        <p className="text-sm text-gray-500">Signed in as</p>
                        <p className="text-sm font-bold text-gray-900 truncate">{user?.email}</p>
                      </div>
                      
                      <div className="py-1">
                        <Link
                          href="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#F68B1E]"
                        >
                          <User className="w-4 h-4" />
                          Account
                        </Link>
                        <Link
                          href="/orders"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#F68B1E]"
                        >
                          <Package className="w-4 h-4" />
                          Orders
                        </Link>
                        <Link
                          href="/settings"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#F68B1E]"
                        >
                          <SettingsIcon className="w-4 h-4" />
                          Settings
                        </Link>
                      </div>

                      {user?.role === 'admin' && (
                        <div className="border-t border-gray-100 py-1">
                          <Link
                            href="/admin/dashboard"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 font-semibold"
                          >
                            <SettingsIcon className="w-4 h-4" />
                            Admin Panel
                          </Link>
                        </div>
                      )}
                      
                      <div className="border-t border-gray-100 py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login" className="hidden md:flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded transition-colors text-gray-700 hover:text-[#F68B1E]">
                  <User className="w-6 h-6" />
                  <div>
                    <p className="text-sm font-bold">Login</p>
                  </div>
                </Link>
              )}

              {/* Help (Desktop) */}
              <div className="hidden lg:flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded-md cursor-pointer text-gray-700">
                <HelpCircle className="w-6 h-6" />
                <span className="text-sm font-medium">Help</span>
                <ChevronDown className="w-3 h-3" />
              </div>

              {/* Cart Icon */}
              <Link href="/cart" className="flex items-center gap-1 md:gap-2 hover:bg-gray-100 px-2 py-1 rounded-md relative group">
                <div className="relative">
                  <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-gray-700 group-hover:text-[#F68B1E] transition-colors" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-[#F68B1E] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
                      {itemCount}
                    </span>
                  )}
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700 group-hover:text-[#F68B1E]">Cart</span>
              </Link>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-full text-gray-700"
              >
                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {showMobileSearch && (
            <div className="md:hidden pb-4">
              <div className="relative flex">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-l-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#F68B1E] focus:border-[#F68B1E] text-sm"
                  placeholder="Search products..."
                />
                <button className="bg-[#F68B1E] hover:bg-orange-600 text-white px-4 py-2 rounded-r-md text-sm font-bold uppercase shadow-sm transition-colors">
                  Search
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={closeMobileMenu}>
          <div 
            className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-bold text-gray-900">Menu</h2>
                <button
                  onClick={closeMobileMenu}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Menu Content */}
              <div className="flex-1 overflow-y-auto">
                {/* User Section */}
                {isAuthenticated() ? (
                  <div className="p-4 bg-gray-50 border-b">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-[#F68B1E] rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{user?.name}</p>
                        <p className="text-sm text-gray-600">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 border-b">
                    <Link
                      href="/login"
                      onClick={closeMobileMenu}
                      className="flex items-center justify-center gap-2 bg-[#F68B1E] text-white px-4 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                    >
                      <User className="w-5 h-5" />
                      Login / Sign Up
                    </Link>
                  </div>
                )}

                {/* Categories */}
                <div className="py-2">
                  <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Categories</h3>
                  <Link
                    href="/products?category=shoes"
                    onClick={closeMobileMenu}
                    className="flex items-center px-4 py-3 text-gray-900 hover:bg-gray-50"
                  >
                    Shoes
                  </Link>
                  <Link
                    href="/products?category=bags"
                    onClick={closeMobileMenu}
                    className="flex items-center px-4 py-3 text-gray-900 hover:bg-gray-50"
                  >
                    Bags
                  </Link>
                  <Link
                    href="/products?category=clothes"
                    onClick={closeMobileMenu}
                    className="flex items-center px-4 py-3 text-gray-900 hover:bg-gray-50"
                  >
                    Clothes
                  </Link>
                </div>

                {/* Account Links */}
                {isAuthenticated() && (
                  <div className="py-2 border-t">
                    <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">My Account</h3>
                    <Link
                      href="/profile"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 px-4 py-3 text-gray-900 hover:bg-gray-50"
                    >
                      <User className="w-5 h-5" />
                      Profile
                    </Link>
                    <Link
                      href="/orders"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 px-4 py-3 text-gray-900 hover:bg-gray-50"
                    >
                      <Package className="w-5 h-5" />
                      Orders
                    </Link>
                    <Link
                      href="/settings"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 px-4 py-3 text-gray-900 hover:bg-gray-50"
                    >
                      <SettingsIcon className="w-5 h-5" />
                      Settings
                    </Link>

                    {user?.role === 'admin' && (
                      <Link
                        href="/admin/dashboard"
                        onClick={closeMobileMenu}
                        className="flex items-center gap-3 px-4 py-3 text-blue-600 hover:bg-blue-50 font-semibold"
                      >
                        <SettingsIcon className="w-5 h-5" />
                        Admin Panel
                      </Link>
                    )}
                  </div>
                )}

                {/* Help */}
                <div className="py-2 border-t">
                  <Link
                    href="/help"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-4 py-3 text-gray-900 hover:bg-gray-50"
                  >
                    <HelpCircle className="w-5 h-5" />
                    Help Center
                  </Link>
                </div>

                {/* Logout */}
                {isAuthenticated() && (
                  <div className="py-2 border-t">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}