"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Store,
  ChevronRight
} from "lucide-react";
import { useAuthStore } from "@/store/authStore"; // Assuming you want the logout logic here

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: Package, label: "Products", href: "/admin/products" },
  { icon: ShoppingCart, label: "Orders", href: "/admin/orders" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuthStore();

  return (
    <aside className="bg-white w-64 min-h-screen border-r border-gray-200 flex flex-col fixed left-0 top-0 bottom-0 z-40 font-sans">
      
      {/* 1. Header / Logo Area */}
      <div className="h-20 flex items-center px-6 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2 group">
             <div className="bg-[#F68B1E] text-white p-1 rounded-sm shadow-sm">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
               </svg>
             </div>
             <div className="flex flex-col">
                <span className="text-lg font-bold text-[#282828] leading-none">
                  Fashion<span className="text-[#F68B1E]">Store</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Vendor Center</span>
             </div>
        </Link>
      </div>

      {/* 2. Navigation Menu */}
      <div className="flex-1 py-6 px-3 overflow-y-auto">
        <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Main Menu</p>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            // Check if current path starts with the link (good for nested routes like /admin/products/edit/1)
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center justify-between px-3 py-3 rounded-md transition-all duration-200 ${
                  isActive
                    ? "bg-orange-50 text-[#F68B1E]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? "text-[#F68B1E]" : "text-gray-400 group-hover:text-gray-600"}`} />
                    <span className={`text-sm font-medium ${isActive ? "font-bold" : ""}`}>{item.label}</span>
                </div>
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#F68B1E]" />}
              </Link>
            );
          })}

          {/* Separator */}
          <div className="pt-4 pb-2">
             <div className="border-t border-gray-100"></div>
          </div>

          <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Store Management</p>
          <Link
                href="/"
                className="group flex items-center gap-3 px-3 py-3 rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
              >
                <Store className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                <span className="text-sm font-medium">View Live Store</span>
          </Link>
        </nav>
      </div>

      {/* 3. Footer / User Profile */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#282828] text-white flex items-center justify-center font-bold">
                {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="overflow-hidden">
                <p className="text-sm font-bold text-gray-900 truncate">{user?.name || 'Admin User'}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email || 'admin@store.com'}</p>
            </div>
        </div>
        
        <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-600 bg-white border border-red-100 hover:bg-red-50 hover:border-red-200 rounded-md transition-all shadow-sm font-medium"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}