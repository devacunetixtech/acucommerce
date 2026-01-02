'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { IProduct } from '@/types';
import toast from 'react-hot-toast';
import { Upload, X, Plus, Trash2, Save, ArrowLeft, ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface ProductFormData {
  name: string;
  description: string;
  category: 'shoes' | 'bags' | 'clothes';
  subcategory: string;
  brand: string;
  gender: 'men' | 'women' | 'unisex' | 'kids';
  price: number;
  discount: number;
  images: string[]; // In a real app, you upload files -> get URLs -> save URLs
  featured: boolean;
  isActive: boolean;
}

interface ProductFormProps {
  product?: IProduct;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
}

export default function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  // 1. Image Preview State
  const [previewImages, setPreviewImages] = useState<string[]>(product?.images || []);
  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<ProductFormData>({
    defaultValues: product || {
      featured: false,
      isActive: true,
      discount: 0,
      images: [],
    },
  });

  const [variants, setVariants] = useState(product?.variants || []);
  const [newVariant, setNewVariant] = useState({
    size: '',
    color: '',
    stock: 0,
    sku: '',
  });

  // --- Image Handling Logic ---
//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (files && files.length > 0) {
//       setUploading(true);
      // SIMULATION: In a real app, upload 'files' to Cloudinary/S3 here.
      // We are creating local object URLs for preview purposes.
//       const newPreviews = Array.from(files).map(file => URL.createObjectURL(file));
      
//       const updatedImages = [...previewImages, ...newPreviews];
//       setPreviewImages(updatedImages);
//       setValue('images', updatedImages); // Update form data
      
//       setUploading(false);
//       toast.success(`${files.length} images added`);
//     }
//   };

  // --- Image Handling Logic (Cloudinary) ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    // Check if files exist
    if (files && files.length > 0) {
      setUploading(true);

      // Cloudinary Configuration
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET;

      // Basic validation
      if (!cloudName || !uploadPreset) {
        console.error('Cloudinary environment variables are missing.');
        toast.error('Image upload configuration error.');
        setUploading(false);
        return;
      }

      try {
        // Create an array of upload promises
        const uploadPromises = Array.from(files).map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', uploadPreset);
          // Optional: Add folder organization
          // formData.append('folder', 'ecommerce_products'); 

          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
              method: 'POST',
              body: formData,
            }
          );

          if (!response.ok) {
            throw new Error('Upload failed');
          }

          const data = await response.json();
          return data.secure_url; // We only need the secure URL
        });

        // Execute all uploads in parallel
        const uploadedUrls = await Promise.all(uploadPromises);

        // Update State & Form Data
        // merging existing images with new uploads
        const updatedImages = [...previewImages, ...uploadedUrls];
        
        setPreviewImages(updatedImages);
        setValue('images', updatedImages); 
        
        toast.success(`${uploadedUrls.length} images uploaded successfully`);

      } catch (error) {
        console.error('Upload Error:', error);
        toast.error('Failed to upload images. Please try again.');
      } finally {
        setUploading(false);
      }
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = previewImages.filter((_, i) => i !== index);
    setPreviewImages(updatedImages);
    setValue('images', updatedImages);
  };

  // --- Variant Logic ---
  const addVariant = () => {
    if (!newVariant.size || !newVariant.color || !newVariant.sku) {
      toast.error('Please fill all variant fields');
      return;
    }
    setVariants([...variants, { ...newVariant }]);
    setNewVariant({ size: '', color: '', stock: 0, sku: '' });
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  // --- Submit Logic ---
  const handleFormSubmit = (data: ProductFormData) => {
    if (variants.length === 0) {
      toast.error('Please add at least one variant');
      return;
    }
    if (previewImages.length === 0) {
        toast.error('Please upload at least one product image');
        return;
    }
    // Combine form data with our local state for variants and images
    onSubmit({ ...data, variants, images: previewImages } as any);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="min-h-screen bg-gray-50 pb-20">
      
      {/* Header Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10 shadow-sm flex justify-between items-center">
         <div className="flex items-center gap-4">
            <button type="button" onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">
                {product ? 'Edit Product' : 'Add New Product'}
            </h1>
         </div>
         <div className="flex gap-3">
            <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
            >
                Discard
            </button>
            <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2 text-sm font-bold text-white bg-[#F68B1E] rounded shadow hover:bg-orange-600 uppercase tracking-wide"
            >
                <Save className="w-4 h-4" />
                Save Product
            </button>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Main Info & Variants */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* 1. Basic Information Card */}
            <div className="bg-white rounded shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 bg-[#F68B1E] rounded-full block"></span>
                    General Information
                </h3>
                
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Product Name</label>
                        <input
                            {...register('name', { required: 'Name is required' })}
                            className="w-full p-3 border border-gray-300 rounded focus:ring-1 focus:ring-[#F68B1E] focus:border-[#F68B1E] transition-colors"
                            placeholder="e.g., Nike Air Max 270"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                        <textarea
                            {...register('description', { required: 'Description is required' })}
                            className="w-full p-3 border border-gray-300 rounded focus:ring-1 focus:ring-[#F68B1E] focus:border-[#F68B1E] transition-colors min-h-[150px]"
                            placeholder="Describe your product features, material, style..."
                        />
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                    </div>
                </div>
            </div>

            {/* 2. Variants Card */}
            <div className="bg-white rounded shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 bg-[#F68B1E] rounded-full block"></span>
                    Product Variants
                </h3>

                {/* Variant Input Row */}
                <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300 mb-6">
                    <p className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">Add New Variant</p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        <input
                            type="text"
                            placeholder="Size (e.g. 42)"
                            value={newVariant.size}
                            onChange={(e) => setNewVariant({ ...newVariant, size: e.target.value })}
                            className="p-2 border rounded focus:border-[#F68B1E] outline-none"
                        />
                        <input
                            type="text"
                            placeholder="Color (e.g. Red)"
                            value={newVariant.color}
                            onChange={(e) => setNewVariant({ ...newVariant, color: e.target.value })}
                            className="p-2 border rounded focus:border-[#F68B1E] outline-none"
                        />
                        <input
                            type="number"
                            placeholder="Stock"
                            value={newVariant.stock}
                            onChange={(e) => setNewVariant({ ...newVariant, stock: parseInt(e.target.value) || 0 })}
                            className="p-2 border rounded focus:border-[#F68B1E] outline-none"
                        />
                        <input
                            type="text"
                            placeholder="SKU-123"
                            value={newVariant.sku}
                            onChange={(e) => setNewVariant({ ...newVariant, sku: e.target.value })}
                            className="p-2 border rounded focus:border-[#F68B1E] outline-none"
                        />
                        <button
                            type="button"
                            onClick={addVariant}
                            className="bg-[#282828] text-white rounded hover:bg-black transition-colors flex items-center justify-center font-bold"
                        >
                            <Plus className="w-4 h-4 mr-1" /> Add
                        </button>
                    </div>
                </div>

                {/* Variants List Table */}
                {variants.length > 0 ? (
                    <div className="overflow-hidden border border-gray-200 rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {variants.map((variant, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-3 text-sm text-gray-900">{variant.size}</td>
                                        <td className="px-4 py-3 text-sm text-gray-900 flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: variant.color.toLowerCase() }}></span>
                                            {variant.color}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">{variant.stock}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500 font-mono">{variant.sku}</td>
                                        <td className="px-4 py-3 text-right">
                                            <button onClick={() => removeVariant(index)} className="text-red-500 hover:text-red-700 p-1">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8 bg-gray-50 rounded border border-dashed text-gray-400 text-sm">
                        No variants added yet.
                    </div>
                )}
            </div>
        </div>

        {/* RIGHT COLUMN: Media & Organization */}
        <div className="space-y-8">
            
            {/* 3. Media Upload Card */}
            <div className="bg-white rounded shadow-sm border border-gray-100 p-6">
                 <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">Product Images</h3>
                 
                 {/* Drag & Drop Area */}
                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-50 transition-colors text-center cursor-pointer relative">
                    <input 
                        type="file" 
                        multiple 
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center pointer-events-none">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm font-medium text-gray-600">Drop files here or click to upload</p>
                        <p className="text-xs text-gray-400 mt-1">Recommended 1200x1200px</p>
                    </div>
                 </div>

                 {/* Image Previews Grid */}
                 {previewImages.length > 0 && (
                     <div className="grid grid-cols-3 gap-2 mt-4">
                        {previewImages.map((img, idx) => (
                            <div key={idx} className="relative aspect-square rounded overflow-hidden border border-gray-200 group">
                                <Image src={img} alt="Preview" fill className="object-cover" />
                                <button 
                                    type="button"
                                    onClick={() => removeImage(idx)}
                                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-3 h-3 text-red-500" />
                                </button>
                            </div>
                        ))}
                     </div>
                 )}
            </div>

            {/* 4. Pricing Card */}
            <div className="bg-white rounded shadow-sm border border-gray-100 p-6">
                <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">Pricing</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Base Price (₦)</label>
                        <input
                            type="number"
                            {...register('price', { required: 'Price is required', min: 0 })}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#F68B1E] focus:border-[#F68B1E]"
                            placeholder="0.00"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Discount (%)</label>
                        <input
                            type="number"
                            {...register('discount', { min: 0, max: 100 })}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#F68B1E] focus:border-[#F68B1E]"
                            placeholder="0"
                        />
                    </div>
                </div>
            </div>

            {/* 5. Organization Card */}
            <div className="bg-white rounded shadow-sm border border-gray-100 p-6">
                <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">Organization</h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Brand</label>
                        <input
                            {...register('brand', { required: 'Brand is required' })}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#F68B1E] focus:border-[#F68B1E]"
                            placeholder="e.g. Adidas"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                            <select
                                {...register('category', { required: 'Required' })}
                                className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#F68B1E] focus:border-[#F68B1E] bg-white"
                            >
                                <option value="">Select</option>
                                <option value="shoes">Shoes</option>
                                <option value="bags">Bags</option>
                                <option value="clothes">Clothes</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Gender</label>
                            <select
                                {...register('gender', { required: 'Required' })}
                                className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#F68B1E] focus:border-[#F68B1E] bg-white"
                            >
                                <option value="">Select</option>
                                <option value="men">Men</option>
                                <option value="women">Women</option>
                                <option value="unisex">Unisex</option>
                                <option value="kids">Kids</option>
                            </select>
                        </div>
                    </div>

                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Subcategory</label>
                        <input
                            {...register('subcategory', { required: 'Subcategory is required' })}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#F68B1E] focus:border-[#F68B1E]"
                            placeholder="e.g. Sneakers"
                        />
                    </div>
                </div>
            </div>

            {/* 6. Visibility Card */}
            <div className="bg-white rounded shadow-sm border border-gray-100 p-6">
                <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">Visibility</h3>
                <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
                        <input type="checkbox" {...register('featured')} className="w-4 h-4 text-[#F68B1E] focus:ring-[#F68B1E] rounded" />
                        <div>
                            <span className="block text-sm font-bold text-gray-800">Featured Product</span>
                            <span className="block text-xs text-gray-500">Show in trending section</span>
                        </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
                        <input type="checkbox" {...register('isActive')} className="w-4 h-4 text-[#F68B1E] focus:ring-[#F68B1E] rounded" />
                        <div>
                            <span className="block text-sm font-bold text-gray-800">Active Status</span>
                            <span className="block text-xs text-gray-500">Product is visible to customers</span>
                        </div>
                    </label>
                </div>
            </div>

        </div>
      </div>
    </form>
  );
}