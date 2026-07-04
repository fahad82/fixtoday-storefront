// app/category/[slug]/page.tsx
'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { productService } from '@/services/productService';
import { getCategoryBySlug } from '@/utils/categoryMapping';
import { Product, PaginationData } from '@/types/product.types';
import { 
  FaFilter, 
  FaTimes, 
  FaChevronLeft, 
  FaChevronRight,
  FaSpinner,
  FaStar,
  FaStarHalfAlt,
  FaRegStar
} from 'react-icons/fa';

// Loading Component
const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px]">
    <FaSpinner className="w-12 h-12 text-blue-600 animate-spin" />
    <p className="mt-4 text-gray-600 animate-pulse">Loading products...</p>
  </div>
);

// Empty State Component
interface EmptyStateProps {
  categoryName: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ categoryName }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
    <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 animate-bounce">
      <span className="text-6xl">📦</span>
    </div>
    <h3 className="text-2xl font-bold text-gray-800 mb-2">Coming Soon!</h3>
    <p className="text-gray-600 max-w-md mb-6">
      We&apos;re working hard to bring you the best {categoryName} products. 
      Check back soon for amazing deals!
    </p>
    <Link
      href="/"
      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transition-all hover:scale-105"
    >
      Continue Shopping
    </Link>
  </div>
);

// Error State Component
interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
    <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center mb-6">
      <span className="text-6xl">⚠️</span>
    </div>
    <h3 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h3>
    <p className="text-gray-600 max-w-md mb-6">{message}</p>
    <button
      onClick={onRetry}
      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
    >
      Try Again
    </button>
  </div>
);

// Filter Sidebar Component
interface FilterSidebarProps {
  filters: any;
  onFilterChange: (filters: any) => void;
  onApply: () => void;
  onClear: () => void;
  isMobile?: boolean;
  onClose?: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ 
  filters, 
  onFilterChange, 
  onApply, 
  onClear,
  isMobile = false,
  onClose 
}) => {
  const priceRanges = [
    { label: 'Under £50', min: 0, max: 50 },
    { label: '£50 - £100', min: 50, max: 100 },
    { label: '£100 - £200', min: 100, max: 200 },
    { label: '£200 - £500', min: 200, max: 500 },
    { label: '£500+', min: 500, max: null }
  ];

  return (
    <div className={isMobile ? 'h-full' : ''}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Filters</h3>
        {isMobile && (
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <FaTimes />
          </button>
        )}
      </div>

      {/* Price Range Quick Select */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">Quick Price</h4>
        <div className="flex flex-wrap gap-2">
          {priceRanges.map((range, index) => (
            <button
              key={index}
              onClick={() => {
                onFilterChange({
                  ...filters,
                  min_price: range.min,
                  max_price: range.max || ''
                });
              }}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors"
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Price Range */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">Custom Price Range</h4>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.min_price}
            onChange={(e) => onFilterChange({ ...filters, min_price: e.target.value })}
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.max_price}
            onChange={(e) => onFilterChange({ ...filters, max_price: e.target.value })}
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Rating Filter */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">Customer Rating</h4>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="rating"
                className="text-blue-600"
                onChange={() => onFilterChange({ ...filters, min_rating: rating })}
              />
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => {
                  if (i < rating) {
                    return <FaStar key={i} className="w-4 h-4 text-amber-400" />;
                  } else if (i < rating + 0.5) {
                    return <FaStarHalfAlt key={i} className="w-4 h-4 text-amber-400" />;
                  } else {
                    return <FaRegStar key={i} className="w-4 h-4 text-gray-300" />;
                  }
                })}
                <span className="text-sm text-gray-600 ml-1">& up</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={onApply}
          className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Apply Filters
        </button>
        <button
          onClick={onClear}
          className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

// Main Category Page Component
const CategoryPageContent: React.FC = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: searchParams.get('sort') || 'created_at',
    sortOrder: (searchParams.get('order') || 'DESC') as 'ASC' | 'DESC',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    page: parseInt(searchParams.get('page') || '1')
  });
  
  const category = getCategoryBySlug(slug);
  const categoryName = category?.name || slug.charAt(0).toUpperCase() + slug.slice(1);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await productService.getProducts({
        category: category?.id,
        ...filters,
        limit: 12,
        status: 'active'
      });
      
      setProducts(result.products);
      setPagination(result.pagination);
      
      // Update URL with filters
      const params = new URLSearchParams();
      if (filters.sortBy !== 'created_at') params.set('sort', filters.sortBy);
      if (filters.sortOrder !== 'DESC') params.set('order', filters.sortOrder);
      if (filters.min_price) params.set('min_price', filters.min_price.toString());
      if (filters.max_price) params.set('max_price', filters.max_price.toString());
      if (filters.page > 1) params.set('page', filters.page.toString());
      
      const queryString = params.toString();
      router.replace(`/category/${slug}${queryString ? `?${queryString}` : ''}`, { scroll: false });
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [slug, filters, category?.id, router]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [sortBy, sortOrder] = e.target.value.split('-');
    setFilters({ ...filters, sortBy, sortOrder: sortOrder as 'ASC' | 'DESC', page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setFilters({
      sortBy: 'created_at',
      sortOrder: 'DESC',
      min_price: '',
      max_price: '',
      page: 1
    });
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} onRetry={fetchProducts} />;
  if (!products.length && !loading) return <EmptyState categoryName={categoryName} />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{categoryName}</h1>
          <p className="text-lg text-blue-100 max-w-2xl">
            {category?.description || `Explore our collection of premium ${categoryName} products`}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <FilterSidebar
                filters={filters}
                onFilterChange={setFilters}
                onApply={fetchProducts}
                onClear={clearFilters}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <FaFilter className="w-4 h-4" />
                  Filters
                </button>
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold text-blue-600">{products.length}</span> products
                  {pagination && <span> of <span className="font-semibold">{pagination.total}</span></span>}
                </p>
              </div>

              <select
                onChange={handleSortChange}
                defaultValue="created_at-DESC"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="created_at-DESC">Newest First</option>
                <option value="base_price-ASC">Price: Low to High</option>
                <option value="base_price-DESC">Price: High to Low</option>
                <option value="name-ASC">Name: A to Z</option>
                <option value="sale_count-DESC">Best Selling</option>
                <option value="view_count-DESC">Most Viewed</option>
              </select>
            </div>

            {/* Mobile Filters Modal */}
            {showFilters && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
                <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl p-6 overflow-y-auto animate-slideInRight">
                  <FilterSidebar
                    filters={filters}
                    onFilterChange={setFilters}
                    onApply={() => {
                      fetchProducts();
                      setShowFilters(false);
                    }}
                    onClear={clearFilters}
                    isMobile
                    onClose={() => setShowFilters(false)}
                  />
                </div>
              </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={!pagination.hasPrev}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FaChevronLeft className="w-4 h-4" />
                </button>
                
                <div className="flex gap-2">
                  {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                    let pageNum: number;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          pagination.page === pageNum
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.hasNext}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FaChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

// Main Component with Suspense
const CategoryPage: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CategoryPageContent />
    </Suspense>
  );
};

export default CategoryPage;