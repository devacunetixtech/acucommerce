'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import PasswordChangeForm from '@/components/user/PasswordChangeForm';
import NotificationSettings from '@/components/user/NotificationSettings';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Loader2, 
  Lock, 
  Bell, 
  Trash2, 
  LogOut,
  Shield,
  Globe,
  Smartphone,
  ChevronRight,
  AlertTriangle,
  UserCog
} from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const { token, isAuthenticated, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'security' | 'notifications' | 'privacy'>('security');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, []);

  const handlePasswordChange = async (data: { currentPassword: string; newPassword: string }) => {
    try {
      setLoading(true);
      const response = await axios.put('/api/users/change-password', data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        toast.success('Password changed successfully!');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
      router.push('/');
      toast.success('Logged out successfully');
    }
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast.error('Account deletion is not implemented yet');
    }
  };

  // Helper for Sidebar Items
  const TabButton = ({ id, icon: Icon, label }: { id: typeof activeTab, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center justify-between px-4 py-4 transition-all duration-200 border-l-4 ${
        activeTab === id
          ? 'bg-white border-[#F68B1E] text-[#F68B1E] shadow-sm'
          : 'border-transparent text-gray-600 hover:bg-white hover:text-gray-900'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${activeTab === id ? 'text-[#F68B1E]' : 'text-gray-400'}`} />
        <span className={`text-sm font-medium ${activeTab === id ? 'font-bold' : ''}`}>{label}</span>
      </div>
      <ChevronRight className={`w-4 h-4 ${activeTab === id ? 'text-[#F68B1E] opacity-100' : 'opacity-0'}`} />
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F3F4F6] pb-12">
      {/* Header */}
      <div className="bg-[#282828] text-white py-8 mb-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <UserCog className="w-6 h-6 text-[#F68B1E]" />
                Account Settings
            </h1>
            <p className="text-gray-400 text-sm mt-1 ml-8">Manage your security, privacy, and preferences.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Sidebar Tabs */}
          <div className="md:col-span-3">
            <div className="bg-gray-50/50 rounded-lg overflow-hidden space-y-1 sticky top-6">
              <p className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Preferences</p>
              <TabButton id="security" icon={Lock} label="Security" />
              <TabButton id="notifications" icon={Bell} label="Notifications" />
              <TabButton id="privacy" icon={Shield} label="Privacy & Data" />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-9 space-y-6">
            
            {activeTab === 'security' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* Password Form */}
                <PasswordChangeForm
                  onSubmit={handlePasswordChange}
                  loading={loading}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 2FA Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-50 rounded-full">
                                <Shield className="w-5 h-5 text-blue-600" />
                            </div>
                            <h2 className="text-sm font-bold uppercase text-gray-800 tracking-wide">Two-Factor Auth</h2>
                        </div>
                        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                            Add an extra layer of security to your account by requiring a code when logging in.
                        </p>
                        
                        

                        <button className="w-full py-2 border border-gray-300 rounded text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                            Enable 2FA
                        </button>
                    </div>

                    {/* Active Sessions */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-green-50 rounded-full">
                                <Smartphone className="w-5 h-5 text-green-600" />
                            </div>
                            <h2 className="text-sm font-bold uppercase text-gray-800 tracking-wide">Active Sessions</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-100">
                                <div>
                                    <p className="font-bold text-sm text-gray-800">Current Device</p>
                                    <p className="text-xs text-gray-500">Lagos, Nigeria • Chrome on Windows</p>
                                </div>
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                            </div>
                            <button className="text-xs text-red-600 font-bold hover:underline">
                                Sign out of all other devices
                            </button>
                        </div>
                    </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="border-b border-gray-100 pb-4 mb-6">
                    <h2 className="text-lg font-bold text-gray-800">Notification Preferences</h2>
                    <p className="text-sm text-gray-500">Choose how we communicate with you.</p>
                </div>
                <NotificationSettings />
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                
                {/* Privacy Settings Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                  <h2 className="text-sm font-bold uppercase text-gray-800 tracking-wide mb-6 border-b border-gray-100 pb-2">
                    Privacy Controls
                  </h2>
                  
                  <div className="space-y-5">
                    {/* Toggle Item */}
                    <label className="flex items-start gap-4 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F68B1E]"></div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 text-sm group-hover:text-[#F68B1E] transition-colors">Public Profile</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Allow other users to see your wishlist and reviews.
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start gap-4 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F68B1E]"></div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 text-sm group-hover:text-[#F68B1E] transition-colors">Activity Status</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Show when you were last active on the platform.
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start gap-4 cursor-pointer group">
                       <div className="relative flex items-center">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F68B1E]"></div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 text-sm group-hover:text-[#F68B1E] transition-colors">Analytics Data</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Share anonymous usage data to help us improve.
                        </p>
                      </div>
                    </label>
                  </div>
                  
                  <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end">
                    <button className="px-6 py-2 bg-[#282828] text-white text-sm font-bold rounded hover:bg-black transition-colors">
                        Save Preferences
                    </button>
                  </div>
                </div>

                {/* Data Export */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                  <h2 className="text-sm font-bold uppercase text-gray-800 tracking-wide mb-4">Your Data</h2>
                  <div className="flex flex-col md:flex-row gap-4">
                    <button className="flex-1 flex items-center justify-between p-4 border border-gray-200 rounded hover:border-[#F68B1E] hover:bg-orange-50 transition-all group">
                       <div className="flex items-center gap-3">
                         <Globe className="w-5 h-5 text-gray-400 group-hover:text-[#F68B1E]" />
                         <span className="text-sm font-medium text-gray-700 group-hover:text-[#F68B1E]">Download My Data</span>
                       </div>
                       <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#F68B1E]" />
                    </button>
                    <button className="flex-1 flex items-center justify-between p-4 border border-gray-200 rounded hover:border-[#F68B1E] hover:bg-orange-50 transition-all group">
                       <div className="flex items-center gap-3">
                         <Shield className="w-5 h-5 text-gray-400 group-hover:text-[#F68B1E]" />
                         <span className="text-sm font-medium text-gray-700 group-hover:text-[#F68B1E]">Privacy Policy</span>
                       </div>
                       <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#F68B1E]" />
                    </button>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-red-50 rounded-lg border border-red-100 p-6">
                   <div className="flex items-center gap-2 mb-4 text-red-700">
                      <AlertTriangle className="w-5 h-5" />
                      <h2 className="text-sm font-bold uppercase tracking-wide">Danger Zone</h2>
                   </div>
                   
                   <div className="space-y-3">
                     <div className="flex items-center justify-between p-4 bg-white border border-red-100 rounded">
                        <div>
                            <p className="font-bold text-sm text-gray-800">Logout</p>
                            <p className="text-xs text-gray-500">Sign out of your account on this device</p>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm font-bold text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                        >
                            Logout
                        </button>
                     </div>

                     <div className="flex items-center justify-between p-4 bg-white border border-red-200 rounded">
                        <div>
                            <p className="font-bold text-sm text-red-600">Delete Account</p>
                            <p className="text-xs text-gray-500">Permanently delete your account and all data</p>
                        </div>
                        <button 
                            onClick={handleDeleteAccount}
                            className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded hover:bg-red-700 transition-colors flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete Account
                        </button>
                     </div>
                   </div>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}