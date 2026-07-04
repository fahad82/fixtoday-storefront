// app/brand/[slug]/page.tsx (ensure it filters by brand_id)
'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import { productService } from '@/services/productService';
import { brandService } from '@/services/brandService';
import { Product, PaginationData, Brand } from '@/types/product.types';
import { 
  FaFilter, 
  FaTimes, 
  FaChevronLeft, 
  FaChevronRight,
  FaSpinner
} from 'react-icons/fa';

// Loading Component
const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px]">
    <FaSpinner className="w-12 h-12 text-blue-600 animate-spin" />
    <p className="mt-4 text-gray-600">Loading products...</p>
  </div>
);

// Empty State Component
interface EmptyStateProps {
  brandName: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ brandName }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
    <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 animate-bounce">
      <span className="text-6xl">📦</span>
    </div>
    <h3 className="text-2xl font-bold text-gray-800 mb-2">Coming Soon!</h3>
    <p className="text-gray-600 max-w-md mb-6">
      We&apos;re working hard to bring you the best {brandName} products. 
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

// Main Brand Page Component
const BrandPageContent: React.FC = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [brand, setBrand] = useState<Brand | null>(null);
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

  // Fetch brand and products
  useEffect(() => {
    const fetchBrandAndProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        // First get the brand by slug
        const brandData = await brandService.getBrandBySlug(slug);
        
        if (!brandData) {
          setError('Brand not found');
          setLoading(false);
          return;
        }
        
        setBrand(brandData);
        
        // Then fetch products for this brand using brand_id filter
        const result = await productService.getProducts({
          brand_id: brandData.id,  // This filters products by brand_id
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
        router.replace(`/brand/${slug}${queryString ? `?${queryString}` : ''}`, { scroll: false });
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBrandAndProducts();
  }, [slug, filters, router]);

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
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  if (!brand) return <ErrorState message="Brand not found" onRetry={() => window.location.reload()} />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Brand Info */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6">
            {brand.logo && (
              <div className="w-24 h-24 bg-white rounded-2xl p-4 shadow-lg">
                <div className="relative w-full h-full">
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{brand.name}</h1>
              {brand.description && (
                <p className="text-lg text-blue-100 max-w-2xl">{brand.description}</p>
              )}
              <p className="text-sm text-blue-200 mt-2">
                {products.length} {products.length === 1 ? 'product' : 'products'} available
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Products Grid */}
        {products.length > 0 ? (
          <>
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

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
          </>
        ) : (
          <EmptyState brandName={brand.name} />
        )}
      </div>
    </div>
  );
};

// Main Component with Suspense
const BrandPage: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <BrandPageContent />
    </Suspense>
  );
};

export default BrandPage;