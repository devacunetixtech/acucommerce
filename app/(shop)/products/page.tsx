'use client';

import { useState, useEffect, Suspense } from 'react'; // Added Suspense
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/product/ProductCard';
import ProductFilters from '@/components/product/ProductFilters';
import { IProduct } from '@/types';
import { Loader2, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';

// 1. RENAME ORIGINAL COMPONENT TO 'ProductsContent' AND REMOVE 'export default'
function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    gender: searchParams.get('gender') || '',
    priceRange: '',
    sort: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    fetchProducts();
  }, [filters, pagination.page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.gender) params.append('gender', filters.gender);
      params.append('page', pagination.page.toString());
      params.append('limit', pagination.limit.toString());

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || '/api'}/products?${params}`
      );
      const data = await response.json();

      if (data.success) {
        let fetchedProducts = data.data.products;

        if (filters.priceRange) {
          const [min, max] = filters.priceRange.split('-').map(Number);
          fetchedProducts = fetchedProducts.filter(
            (p: IProduct) => p.price >= min && p.price <= max
          );
        }

        if (filters.sort) {
          switch (filters.sort) {
            case 'price-asc':
              fetchedProducts.sort((a: IProduct, b: IProduct) => a.price - b.price);
              break;
            case 'price-desc':
              fetchedProducts.sort((a: IProduct, b: IProduct) => b.price - a.price);
              break;
            case 'newest':
              fetchedProducts.sort((a: IProduct, b: IProduct) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              );
              break;
            case 'rating':
              fetchedProducts.sort((a: IProduct, b: IProduct) => 
                b.averageRating - a.averageRating
              );
              break;
          }
        }

        setProducts(fetchedProducts);
        setPagination(prev => ({
          ...prev,
          total: data.data.pagination.total,
          pages: data.data.pagination.pages,
        }));
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
    setShowFilters(false);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (pagination.pages <= maxVisible) {
      for (let i = 1; i <= pagination.pages; i++) {
        pages.push(i);
      }
    } else {
      if (pagination.page <= 3) {
        pages.push(1, 2, 3, 4, '...', pagination.pages);
      } else if (pagination.page >= pagination.pages - 2) {
        pages.push(1, '...', pagination.pages - 3, pagination.pages - 2, pagination.pages - 1, pagination.pages);
      } else {
        pages.push(1, '...', pagination.page - 1, pagination.page, pagination.page + 1, '...', pagination.pages);
      }
    }
    
    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Products</h1>
              {!loading && (
                <p className="mt-1 text-sm text-gray-500">
                  {pagination.total} {pagination.total === 1 ? 'product' : 'products'} available
                </p>
              )}
            </div>
            
            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-sm font-medium">Filters</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <div className="mb-6">
                <h1 className="text-xl font-bold text-gray-900">Products</h1>
                {!loading && (
                  <p className="mt-1 text-xs text-gray-500">
                    {pagination.total} {pagination.total === 1 ? 'product' : 'products'}
                  </p>
                )}
              </div>
              <div className="border-t pt-4">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">Filters</h2>
                <ProductFilters
                  onFilterChange={handleFilterChange}
                  selectedFilters={filters}
                />
              </div>
            </div>
          </div>

          {/* Mobile Filters Overlay */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setShowFilters(false)}>
              <div 
                className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 overflow-y-auto h-[calc(100%-80px)]">
                  <ProductFilters
                    onFilterChange={handleFilterChange}
                    selectedFilters={filters}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex flex-col justify-center items-center h-96 bg-white rounded-xl shadow-sm border border-gray-200">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
                <p className="text-gray-500">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-96 bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <SlidersHorizontal className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-500">Try adjusting your filters</p>
                </div>
              </div>
            ) : (
              <>
                {/* Products Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <p className="text-sm text-gray-600">
                        Page {pagination.page} of {pagination.pages}
                      </p>
                      
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                          disabled={pagination.page === 1}
                          className="p-2 border border-gray-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                          aria-label="Previous page"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        
                        <div className="hidden sm:flex items-center gap-1">
                          {getPageNumbers().map((pageNum, index) => (
                            pageNum === '...' ? (
                              <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">
                                ...
                              </span>
                            ) : (
                              <button
                                key={pageNum}
                                onClick={() => setPagination(prev => ({ ...prev, page: pageNum as number }))}
                                className={`min-w-[40px] px-3 py-2 rounded-lg font-medium transition-all ${
                                  pagination.page === pageNum
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                {pageNum}
                              </button>
                            )
                          ))}
                        </div>

                        {/* Mobile page indicator */}
                        <div className="sm:hidden px-4 py-2 text-sm font-medium text-gray-700">
                          {pagination.page} / {pagination.pages}
                        </div>

                        <button
                          onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                          disabled={pagination.page === pagination.pages}
                          className="p-2 border border-gray-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                          aria-label="Next page"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. CREATE A WRAPPER COMPONENT THAT USES SUSPENSE
export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-500 font-medium">Loading store...</p>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}