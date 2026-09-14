// src/app/page.tsx
"use client";

import React, { useState, useCallback, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import FAQSection from '../components/home/FAQSection';
import ProductGrid from '../components/products/ProductGrid';
import ProductFilters from '../components/products/ProductFilters';
import CartDrawer from '../components/cart/CartDrawer';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { useFilters } from '../hooks/useFilters';
import { FaFilter, FaThList, FaThLarge, FaTimes } from 'react-icons/fa';

interface FiltersState {
  [key: string]: any;
}

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<FiltersState>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { products, loading, hasMore, loadMore, applyFilters, resetFilters } = useProducts({
    status: 'active',
    limit: 12,
  });

  const { categories } = useCategories();
  const { filterOptions } = useFilters(selectedCategory || undefined);

  const handleCategorySelect = useCallback((categoryId: string | null) => {
    setSelectedCategory(categoryId);
    applyFilters({ category_id: categoryId || undefined });
    setIsFilterOpen(false);
  }, [applyFilters]);

  const handleApplyFilters = useCallback((newFilters: FiltersState) => {
    setFilters(newFilters);
    applyFilters(newFilters);
    setIsFilterOpen(false);
  }, [applyFilters]);

  const handleResetFilters = useCallback(() => {
    setFilters({});
    resetFilters();
    setSelectedCategory(null);
  }, [resetFilters]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFilterOpen(false);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  const currentCategoryName = selectedCategory
    ? categories.find(c => c.id === selectedCategory)?.name
    : null;

  return (
    <>
      <Head>
        <title>FixToday - Premium Products for Every Need</title>
        <meta name="description" content="Discover premium products at FixToday - Your trusted online store" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Navbar onCategorySelect={handleCategorySelect} />

        <main className="container mx-auto px-4 pt-10 pb-10">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-3 flex-wrap gap-2">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
                  isFilterOpen
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:shadow-md'
                }`}
              >
                <FaFilter className={isFilterOpen ? 'text-white' : 'text-gray-500'} />
                <span className="text-sm">Filters</span>
                {Object.keys(filters).length > 0 && (
                  <span className="w-5 h-5 bg-white/20 text-white text-xs rounded-full flex items-center justify-center">
                    {Object.keys(filters).length}
                  </span>
                )}
              </button>

              <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 transition-all ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <FaThLarge />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 transition-all ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <FaThList />
                </button>
              </div>

              <span className="text-sm text-gray-400 ml-2 hidden sm:inline">
                {products.length} results
              </span>
            </div>

            {/* Active Filters */}
            {Object.keys(filters).length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {Object.entries(filters).map(([key, value]) => {
                  if (!value) return null;
                  const label = key.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
                  return (
                    <span key={key} className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-100">
                      <span>{label}: <span className="font-medium">{String(value)}</span></span>
                      <button
                        onClick={() => {
                          const newFilters = { ...filters };
                          delete newFilters[key];
                          setFilters(newFilters);
                          applyFilters(newFilters);
                        }}
                        className="hover:text-blue-900 p-0.5"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters Sidebar */}
            <div className={`lg:block ${isFilterOpen ? 'block animate-slideDown' : 'hidden'} lg:w-72 flex-shrink-0`}>
              <ProductFilters
                filterOptions={filterOptions}
                selectedCategory={selectedCategory}
                onApplyFilters={handleApplyFilters}
                onResetFilters={handleResetFilters}
                currentFilters={filters}
                categories={categories}
              />
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              <ProductGrid
                products={products}
                loading={loading}
                hasMore={hasMore}
                onLoadMore={loadMore}
                variant={viewMode === 'grid' ? 'default' : 'compact'}
              />
            </div>
          </div>
        </main>

           <CartDrawer />

        {/* FAQ Section */}
        <FAQSection />

     
        <Footer />
      </div>
    </>
  );
}