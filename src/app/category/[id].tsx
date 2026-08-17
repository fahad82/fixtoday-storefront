// src/app/category/[id]/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@/components/common/Navbar';
import ProductGrid from '@/components/products/ProductGrid';
import CartDrawer from '@/components/cart/CartDrawer';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import Loader from '@/components/common/Loader';
import { FaArrowLeft, FaStore } from 'react-icons/fa';

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params?.id as string;

  const { categories, loading: categoriesLoading } = useCategories();
  const [categoryName, setCategoryName] = useState<string>('');

  const { products, loading, hasMore, loadMore, applyFilters, resetFilters } = useProducts({
    status: 'active',
    limit: 12,
    category_id: categoryId,
  });

  useEffect(() => {
    if (categories.length > 0 && categoryId) {
      const category = categories.find(c => c.id === categoryId);
      if (category) {
        setCategoryName(category.name);
      } else {
        setCategoryName('Category');
      }
    }
  }, [categories, categoryId]);

  const handleCategorySelect = (newCategoryId: string | null) => {
    if (newCategoryId) {
      router.push(`/category/${newCategoryId}`);
    } else {
      router.push('/');
    }
  };

  if (categoriesLoading || loading) {
    return (
      <>
        <Navbar onCategorySelect={handleCategorySelect} />
        <div className="min-h-screen flex items-center justify-center pt-20">
          <Loader size="large" />
        </div>
        <CartDrawer />
      </>
    );
  }

  return (
    <WishlistProvider>
      <CartProvider>
        <Head>
          <title>{categoryName || 'Category'} - FixToday</title>
          <meta name="description" content={`Browse ${categoryName} products at FixToday`} />
        </Head>

        <div className="min-h-screen bg-gray-50">
          <Navbar onCategorySelect={handleCategorySelect} />

          <main className="container mx-auto px-4 pt-[140px] pb-12">
            {/* Category Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <Link
                  href="/"
                  className="inline-flex items-center space-x-2 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-2"
                >
                  <FaArrowLeft className="text-xs" />
                  <span>Back to all products</span>
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                  <span>{categoryName || 'Products'}</span>
                  <span className="text-sm font-normal text-gray-400">
                    ({products.length} items)
                  </span>
                </h1>
              </div>
            </div>

            {/* Products */}
            <ProductGrid
              products={products}
              loading={loading}
              hasMore={hasMore}
              onLoadMore={loadMore}
            />
          </main>

          <CartDrawer />
        </div>
      </CartProvider>
    </WishlistProvider>
  );
}