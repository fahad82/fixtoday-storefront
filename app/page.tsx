// app/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product, Brand, FilterOptions, AppliedFilters } from '@/types/product.types';
import { productService } from '@/services/productService';
import { brandService } from '@/services/brandService';
import { filterService } from '@/services/filterService';
import ProductCard from '@/components/ProductCard';
import FilterSidebar from '@/components/FilterSidebar';
import { 
  FaTruck, 
  FaShieldAlt, 
  FaUndo, 
  FaHeadset, 
  FaStar, 
  FaArrowRight,
  FaMobileAlt,
  FaLaptop,
  FaHeadphones,
  FaGamepad,
  FaFilter,
  FaTimes,
  FaSpinner,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredBrands, setFeaturedBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Active filters state
  const [activeFilters, setActiveFilters] = useState<AppliedFilters>({
    minPrice: 0,
    maxPrice: 1000,
    storage: [],
    ram: [],
    colors: [],
    screenSize: [],
    processor: [],
    batteryCapacity: [],
    camera: [],
    network: [],
    os: [],
    refreshRate: [],
    chargingSpeed: [],
    waterResistance: [],
    sortBy: 'created_at',
    sortOrder: 'DESC',
    page: 1,
    inStock: false
  });

  // Initialize filters
  useEffect(() => {
    const initializeFilters = async () => {
      try {
        const options = await filterService.getFilterOptions();
        setFilterOptions(options);
        setActiveFilters(prev => ({
          ...prev,
          minPrice: options.minPrice,
          maxPrice: options.maxPrice
        }));
      } catch (error) {
        console.error('Error loading filter options:', error);
        const defaultOptions = filterService.getDefaultFilterOptions();
        setFilterOptions(defaultOptions);
      }
    };
    
    initializeFilters();
  }, []);

  // Fetch products with filters
  const fetchProducts = useCallback(async () => {
    if (!filterOptions) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { minPrice, maxPrice, page, sortBy, sortOrder, ...otherFilters } = activeFilters;
      
      const productFilters: any = {
        min_price: minPrice,
        max_price: maxPrice,
        page,
        limit: 12,
        sortBy,
        sortOrder,
        status: 'active',
        ...(otherFilters.brand_id && { brand_id: otherFilters.brand_id }),
        ...(otherFilters.category_id && { category_id: otherFilters.category_id }),
        ...(otherFilters.inStock && { in_stock: true }),
        ...(otherFilters.storage && otherFilters.storage.length > 0 && { storage: otherFilters.storage.join(',') }),
        ...(otherFilters.ram && otherFilters.ram.length > 0 && { ram: otherFilters.ram.join(',') }),
        ...(otherFilters.colors && otherFilters.colors.length > 0 && { colors: otherFilters.colors.join(',') }),
        ...(otherFilters.screenSize && otherFilters.screenSize.length > 0 && { screen_size: otherFilters.screenSize.join(',') }),
        ...(otherFilters.processor && otherFilters.processor.length > 0 && { processor: otherFilters.processor.join(',') }),
        ...(otherFilters.batteryCapacity && otherFilters.batteryCapacity.length > 0 && { battery: otherFilters.batteryCapacity.join(',') }),
        ...(otherFilters.camera && otherFilters.camera.length > 0 && { camera: otherFilters.camera.join(',') }),
        ...(otherFilters.network && otherFilters.network.length > 0 && { network: otherFilters.network.join(',') }),
        ...(otherFilters.os && otherFilters.os.length > 0 && { os: otherFilters.os.join(',') }),
        ...(otherFilters.refreshRate && otherFilters.refreshRate.length > 0 && { refresh_rate: otherFilters.refreshRate.join(',') }),
        ...(otherFilters.chargingSpeed && otherFilters.chargingSpeed.length > 0 && { charging: otherFilters.chargingSpeed.join(',') }),
        ...(otherFilters.waterResistance && otherFilters.waterResistance.length > 0 && { water_resistance: otherFilters.waterResistance.join(',') }),
      };
      
      const result = await productService.getProducts(productFilters);
      
      setProducts(result.products || []);
      setPagination(result.pagination);
      
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  }, [activeFilters, filterOptions]);

  // Fetch featured brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const brands = await brandService.getBrands();
        setFeaturedBrands(brands.slice(0, 8));
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };
    fetchBrands();
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    if (filterOptions) {
      fetchProducts();
    }
  }, [activeFilters, fetchProducts, filterOptions]);

  const handleFilterChange = (filters: Partial<AppliedFilters>) => {
    setActiveFilters(prev => ({
      ...prev,
      ...filters,
      page: 1
    }));
  };

  const handleResetFilters = () => {
    if (filterOptions) {
      setActiveFilters({
        minPrice: filterOptions.minPrice,
        maxPrice: filterOptions.maxPrice,
        storage: [],
        ram: [],
        colors: [],
        screenSize: [],
        processor: [],
        batteryCapacity: [],
        camera: [],
        network: [],
        os: [],
        refreshRate: [],
        chargingSpeed: [],
        waterResistance: [],
        sortBy: 'created_at',
        sortOrder: 'DESC',
        page: 1,
        inStock: false
      });
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [sortBy, sortOrder] = e.target.value.split('-');
    setActiveFilters(prev => ({
      ...prev,
      sortBy,
      sortOrder: sortOrder as 'ASC' | 'DESC',
      page: 1
    }));
  };

  const handlePageChange = (newPage: number) => {
    setActiveFilters(prev => ({
      ...prev,
      page: newPage
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading state
  if (isInitialLoad && loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-600 border-t-transparent"></div>
        <p className="mt-6 text-gray-600 font-medium">Loading amazing deals for you...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="text-7xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section - Full Width */}
      <section className="relative bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white overflow-hidden w-full">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        <div className="w-full px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <div className="">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                  <span className="text-yellow-400 text-sm">⚡</span>
                  <span className="text-sm font-medium">Summer Sale is Live</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in">
                  Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">FixToday</span>
                </h1>
                <p className="text-lg md:text-xl mb-8 text-blue-100 leading-relaxed">
                  Discover the latest in technology - from premium smartphones to powerful gaming consoles. 
                  Get the best deals on top brands.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link 
                    href="/products" 
                    className="bg-white text-blue-900 px-8 py-3 rounded-xl font-semibold hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2 group"
                  >
                    Shop Now
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link 
                    href="/deals" 
                    className="border-2 border-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-900 transition-all hover:scale-105"
                  >
                    View Deals
                  </Link>
                </div>
              </div>
              <div className="hidden lg:block relative">
                <div className="relative h-80 w-full">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full blur-3xl opacity-30"></div>
                  <div className="relative z-10 flex justify-center gap-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 transform rotate-6 hover:rotate-0 transition-transform">
                      <FaMobileAlt className="w-16 h-16 text-white" />
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 transform -rotate-6 hover:rotate-0 transition-transform">
                      <FaLaptop className="w-16 h-16 text-white" />
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 transform rotate-12 hover:rotate-0 transition-transform">
                      <FaHeadphones className="w-16 h-16 text-white" />
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 transform -rotate-12 hover:rotate-0 transition-transform">
                      <FaGamepad className="w-16 h-16 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brands Section - Full Width */}
      <section className="py-16 bg-white w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Shop by Brand</h2>
              <p className="text-gray-600 text-lg">Explore products from top brands</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {featuredBrands.map((brand) => (
                <Link 
                  key={brand.id} 
                  href={`/brand/${brand.slug}`} 
                  className="group"
                >
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 text-center hover:shadow-2xl transition-all hover:-translate-y-2 border border-gray-100">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center group-hover:from-blue-100 group-hover:to-indigo-100 transition-all">
                      {brand.logo ? (
                        <div className="relative w-12 h-12">
                          <Image
                            src={brand.logo}
                            alt={brand.name}
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 48px, 48px"
                          />
                        </div>
                      ) : (
                        <span className="text-4xl">🏢</span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                      {brand.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Section with Filters - Full Width */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">All Products</h2>
                <p className="text-gray-600 mt-2">
                  {pagination?.total || 0} products available
                  {activeFilters.storage?.length > 0 && ` · ${activeFilters.storage.length} storage filters`}
                  {activeFilters.colors?.length > 0 && ` · ${activeFilters.colors.length} color filters`}
                </p>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="md:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FaFilter className="w-4 h-4" />
                  <span>Filters</span>
                  {activeFilters.storage?.length > 0 || activeFilters.colors?.length > 0 || activeFilters.ram?.length > 0 && (
                    <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                      {activeFilters.storage?.length + activeFilters.colors?.length + activeFilters.ram?.length}
                    </span>
                  )}
                </button>
                
                {/* Sort Dropdown */}
                <select
                  onChange={handleSortChange}
                  value={`${activeFilters.sortBy}-${activeFilters.sortOrder}`}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  {filterOptions?.sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-8">
              {/* Desktop Filter Sidebar */}
              <div className="hidden md:block flex-shrink-0">
                {filterOptions && (
                  <FilterSidebar
                    filters={filterOptions}
                    activeFilters={activeFilters}
                    onFilterChange={handleFilterChange}
                    onResetFilters={handleResetFilters}
                  />
                )}
              </div>

              {/* Products Grid */}
              <div className="flex-1">
                {loading ? (
                  <div className="flex justify-center items-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                  </div>
                ) : products.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
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
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No products found</h3>
                    <p className="text-gray-600">Try adjusting your filters or search terms.</p>
                    <button
                      onClick={handleResetFilters}
                      className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Reset Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Filter Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white animate-slide-in">
            {filterOptions && (
              <FilterSidebar
                filters={filterOptions}
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
                isMobile
                onClose={() => setShowMobileFilters(false)}
              />
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}