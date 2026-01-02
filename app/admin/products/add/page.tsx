'use client';

import { useRouter } from 'next/navigation';
import ProductForm from '@/components/admin/ProductForm';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export default function AddProductPage() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);

  const handleSubmit = async (data: any) => {
    try {
      const response = await axios.post('/api/products', data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        toast.success('Product created successfully!');
        router.push('/admin/products');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create product');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Add New Product</h1>
      <ProductForm
        onSubmit={handleSubmit}
        onCancel={() => router.push('/admin/products')}
      />
    </div>
  );
}