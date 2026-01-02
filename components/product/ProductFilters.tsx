'use client';

import { X, Filter, ChevronDown } from 'lucide-react';

interface FilterOption {
  label: string;
  value: string;
}

interface ProductFiltersProps {
  onFilterChange: (filters: any) => void;
  selectedFilters: any;
}

export default function ProductFilters({ onFilterChange, selectedFilters }: ProductFiltersProps) {
  const categories: FilterOption[] = [
    { label: 'All Categories', value: '' },
    { label: 'Shoes & Sneakers', value: 'shoes' },
    { label: 'Bags & Accessories', value: 'bags' },
    { label: 'Clothing & Apparel', value: 'clothes' },
  ];

  const genders: FilterOption[] = [
    { label: 'All', value: '' },
    { label: 'Men', value: 'men' },
    { label: 'Women', value: 'women' },
    { label: 'Unisex', value: 'unisex' },
    { label: 'Kids', value: 'kids' },
  ];

  const priceRanges: FilterOption[] = [
    { label: 'All Prices', value: '' },
    { label: 'Under ₦10,000', value: '0-10000' },
    { label: '₦10,000 - ₦25,000', value: '10000-25000' },
    { label: '₦25,000 - ₦50,000', value: '25000-50000' },
    { label: 'Over ₦50,000', value: '50000-999999' },
  ];

  const handleFilterChange = (key: string, value: string) => {
    onFilterChange({ ...selectedFilters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = Object.values(selectedFilters).some(v => v !== '');

  return (
    <div className="bg-white rounded shadow-sm border border-gray-100 font-sans">
      
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50 rounded-t">
        <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#F68B1E]" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800">Product Filters</h2>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1 uppercase"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      <div className="p-4 space-y-6">
        
        {/* Sort By (Select Box Style) */}
        <div>
           <h3 className="text-xs font-bold text-gray-900 uppercase mb-3">Sort By</h3>
           <div className="relative">
             <select
                value={selectedFilters.sort || ''}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="w-full appearance-none p-2.5 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:border-[#F68B1E] focus:ring-1 focus:ring-[#F68B1E] cursor-pointer"
             >
                <option value="">Default Sorting</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">New Arrivals</option>
                <option value="rating">Best Rating</option>
             </select>
             <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
           </div>
        </div>

        <hr className="border-gray-100" />

        {/* Category Filter */}
        <div>
          <h3 className="text-xs font-bold text-gray-900 uppercase mb-3">Category</h3>
          <div className="space-y-2">
            {categories.map((cat) => (
              <label key={cat.value} className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  name="category"
                  value={cat.value}
                  checked={selectedFilters.category === cat.value}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-4 h-4 border-gray-300 text-[#F68B1E] focus:ring-[#F68B1E] accent-[#F68B1E]"
                />
                <span className={`ml-2 text-sm ${selectedFilters.category === cat.value ? 'text-[#F68B1E] font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>
                    {cat.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Gender Filter */}
        <div>
          <h3 className="text-xs font-bold text-gray-900 uppercase mb-3">Gender</h3>
          <div className="space-y-2">
            {genders.map((gender) => (
              <label key={gender.value} className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  name="gender"
                  value={gender.value}
                  checked={selectedFilters.gender === gender.value}
                  onChange={(e) => handleFilterChange('gender', e.target.value)}
                  className="w-4 h-4 border-gray-300 text-[#F68B1E] focus:ring-[#F68B1E] accent-[#F68B1E]"
                />
                <span className={`ml-2 text-sm ${selectedFilters.gender === gender.value ? 'text-[#F68B1E] font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>
                    {gender.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Price Range Filter */}
        <div>
          <h3 className="text-xs font-bold text-gray-900 uppercase mb-3">Price (₦)</h3>
          <div className="space-y-2">
            {priceRanges.map((range) => (
              <label key={range.value} className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  name="priceRange"
                  value={range.value}
                  checked={selectedFilters.priceRange === range.value}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  className="w-4 h-4 border-gray-300 text-[#F68B1E] focus:ring-[#F68B1E] accent-[#F68B1E]"
                />
                <span className={`ml-2 text-sm ${selectedFilters.priceRange === range.value ? 'text-[#F68B1E] font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>
                    {range.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}