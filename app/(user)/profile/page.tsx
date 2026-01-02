'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import ProfileForm from '@/components/user/ProfileForm'; // Ensure path matches where you saved the form
import AddressCard from '@/components/user/AddressCard'; // Ensure path matches
import AddressForm from '@/components/user/AddressForm'; // Ensure path matches
import { IAddress } from '@/types';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Loader2, 
  Plus, 
  User, 
  MapPin, 
  Package, 
  Settings, 
  Heart,
  LogOut,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const { user, token, isAuthenticated, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses'>('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [addresses, setAddresses] = useState<(IAddress & { _id: string })[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<(IAddress & { _id: string }) | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    fetchProfile();
    fetchAddresses();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setProfile(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await axios.get('/api/users/addresses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setAddresses(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    }
  };

  const handleProfileUpdate = async (data: any) => {
    try {
      setSaving(true);
      const response = await axios.put('/api/users/profile', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        toast.success('Profile updated successfully');
        setProfile(response.data.data);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAddressSubmit = async (data: any) => {
    try {
      setSaving(true);
      if (editingAddress) {
        const response = await axios.put(
          `/api/users/addresses/${editingAddress._id}`,
          data,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          toast.success('Address updated successfully');
          fetchAddresses();
        }
      } else {
        const response = await axios.post('/api/users/addresses', data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          toast.success('Address added successfully');
          fetchAddresses();
        }
      }
      setShowAddressForm(false);
      setEditingAddress(null);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to save address');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      const response = await axios.delete(`/api/users/addresses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        toast.success('Address deleted successfully');
        fetchAddresses();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete address');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[#F68B1E]" />
      </div>
    );
  }

  // Sidebar Link Helper
  const SidebarLink = ({ 
    active, 
    onClick, 
    icon: Icon, 
    label, 
    href 
  }: { active?: boolean, onClick?: () => void, icon: any, label: string, href?: string }) => {
    const content = (
      <>
        <Icon className={`w-5 h-5 ${active ? 'text-[#F68B1E]' : 'text-gray-500'}`} />
        <span className={`text-sm font-medium ${active ? 'text-[#F68B1E]' : 'text-gray-700'}`}>{label}</span>
      </>
    );

    const baseClasses = `w-full flex items-center gap-3 px-4 py-3.5 transition-all duration-200 hover:bg-gray-50 ${active ? 'bg-orange-50/50 border-l-4 border-[#F68B1E]' : 'border-l-4 border-transparent'}`;

    if (href) {
        return <Link href={href} className={baseClasses}>{content}</Link>;
    }
    return <button onClick={onClick} className={baseClasses}>{content}</button>;
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] pb-12">
      {/* Page Title Background */}
      <div className="bg-[#282828] text-white py-8 mb-6">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold">My Account</h1>
            <p className="text-gray-400 text-sm mt-1">Manage your details and preferences.</p>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden sticky top-24">
              
              {/* User Greeting Box */}
              <div className="p-4 border-b border-gray-100 bg-gray-50">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        <User className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Hello,</p>
                        <p className="font-bold text-gray-900 truncate max-w-[150px]">{profile?.name || 'User'}</p>
                    </div>
                 </div>
              </div>

              {/* Navigation Links */}
              <div className="py-2">
                <SidebarLink 
                    active={activeTab === 'profile'} 
                    onClick={() => setActiveTab('profile')} 
                    icon={User} 
                    label="My Profile" 
                />
                <SidebarLink 
                    active={activeTab === 'addresses'} 
                    onClick={() => setActiveTab('addresses')} 
                    icon={MapPin} 
                    label="Address Book" 
                />
                <SidebarLink 
                    href="/orders" 
                    icon={Package} 
                    label="Orders" 
                />
                <SidebarLink 
                    href="/wishlist" 
                    icon={Heart} 
                    label="Saved Items" 
                />
                <SidebarLink 
                    href="/settings" 
                    icon={Settings} 
                    label="Settings" 
                />
                
                <div className="border-t border-gray-100 my-2 pt-2">
                    <button 
                        onClick={() => { logout(); router.push('/login'); }} 
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors border-l-4 border-transparent"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm font-medium">Logout</span>
                    </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-100">
                    <h2 className="text-sm font-bold uppercase text-gray-800 tracking-wide">Account Overview</h2>
                  </div>
                  
                  {profile && (
                    <ProfileForm
                      defaultValues={{
                        name: profile.name,
                        email: profile.email,
                        phone: profile.phone || '',
                      }}
                      onSubmit={handleProfileUpdate}
                      loading={saving}
                    />
                  )}
                </div>
              </div>
            )}

            {/* ADDRESSES TAB */}
            {activeTab === 'addresses' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-2 border-b border-gray-100">
                    <div>
                        <h2 className="text-sm font-bold uppercase text-gray-800 tracking-wide">Address Book</h2>
                        <p className="text-xs text-gray-500 mt-1">Manage your shipping destinations.</p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingAddress(null);
                        setShowAddressForm(true);
                      }}
                      className="flex items-center gap-2 bg-[#F68B1E] text-white px-5 py-2.5 rounded shadow-sm hover:bg-orange-600 transition-colors text-sm font-bold uppercase tracking-wide"
                    >
                      <Plus className="w-4 h-4" />
                      Add New Address
                    </button>
                  </div>

                  {addresses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50 rounded border border-dashed border-gray-300">
                      <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                        <MapPin className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-900 font-medium">No saved addresses</p>
                      <p className="text-sm text-gray-500 mt-1">Add a delivery address to checkout faster.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map((address) => (
                        <AddressCard
                          key={address._id}
                          address={address}
                          onEdit={(addr) => {
                            setEditingAddress(addr);
                            setShowAddressForm(true);
                          }}
                          onDelete={handleDeleteAddress}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Address Form Modal */}
      {showAddressForm && (
        <AddressForm
          address={editingAddress || undefined}
          onSubmit={handleAddressSubmit}
          onCancel={() => {
            setShowAddressForm(false);
            setEditingAddress(null);
          }}
          loading={saving}
        />
      )}
    </div>
  );
}