// src/components/products/ProductGrid.tsx
"use client";

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Product } from '../../types';
import ProductCard from './ProductCard';
import { FaSpinner, FaArrowRight } from 'react-icons/fa';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  variant?: 'default' | 'compact' | 'featured' | 'grid';
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  showFilter?: boolean;
  totalItems?: number;
  currentPage?: number;
  itemsPerPage?: number;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading = false,
  hasMore = false,
  onLoadMore,
  variant = 'default',
  columns = { mobile: 2, tablet: 3, desktop: 4 },
  showFilter = true,
  totalItems = 0,
  currentPage = 1,
  itemsPerPage = 12,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('newest');

  const getGridClasses = useCallback(() => {
    const mobileCols = columns.mobile || 2;
    const tabletCols = columns.tablet || 3;
    const desktopCols = columns.desktop || 4;

    return `grid grid-cols-${mobileCols} sm:grid-cols-${tabletCols} lg:grid-cols-${desktopCols} gap-4 md:gap-6`;
  }, [columns]);

  // Loading skeleton
  if (loading && products.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-6 w-32 bg-gray-200 rounded shimmer"></div>
          <div className="h-10 w-40 bg-gray-200 rounded shimmer"></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 shimmer"></div>
              <div className="p-4 space-y-3">
                <div className="h-3 bg-gray-200 rounded w-1/3 shimmer"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 shimmer"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 shimmer"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3 shimmer"></div>
                <div className="h-10 bg-gray-200 rounded shimmer"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100"
      >
        <div className="text-gray-300 text-7xl mb-6">🔍</div>
        <h3 className="text-2xl font-bold text-gray-700">No products found</h3>
        <p className="text-gray-400 mt-3 max-w-md mx-auto">
          We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
        </p>
        <Link
          href="/"
          className="inline-block mt-6 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-200 transition-all"
        >
          Browse All Products
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-xl p-4 border border-gray-100">
        <div className="flex items-center space-x-4">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{products.length}</span> of{' '}
            <span className="font-semibold text-gray-900">{totalItems || products.length}</span> products
          </p>
          {currentPage && itemsPerPage && (
            <span className="text-xs text-gray-400">
              Page {currentPage} of {Math.ceil((totalItems || products.length) / itemsPerPage)}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {/* View Toggle */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
              aria-label="Grid view"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
              aria-label="List view"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="popular">Most Popular</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className={viewMode === 'grid' ? getGridClasses() : 'space-y-4'}>
        <AnimatePresence mode="wait">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className={viewMode === 'list' ? 'w-full' : ''}
            >
              <ProductCard 
                product={product} 
                variant={viewMode === 'list' ? 'compact' : variant}
                priority={index < 4}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center pt-6">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="group px-10 py-4 bg-white border-2 border-blue-600 text-blue-600 rounded-2xl font-medium hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto shadow-sm hover:shadow-lg"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <span>Load More Products</span>
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;