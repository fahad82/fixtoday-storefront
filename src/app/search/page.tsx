// src/app/search/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../../components/common/Navbar';
import ProductGrid from '../../components/products/ProductGrid';
import CartDrawer from '../../components/cart/CartDrawer';
import { useProducts } from '../../hooks/useProducts';
import { CartProvider } from '../../context/CartContext';
import { WishlistProvider } from '../../context/WishlistContext';
import Loader from '../../components/common/Loader';
import { FaSearch } from 'react-icons/fa';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams?.get('q') || '';

  const { products, loading, hasMore, loadMore } = useProducts({
    status: 'active',
    limit: 12,
    search: query,
  });

  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(() => {
    setSearchQuery(query);
  }, [query]);

  return (
    <WishlistProvider>
      <CartProvider>
        <Head>
          <title>{query ? `Search: ${query}` : 'Search'} - FixToday</title>
          <meta name="description" content={`Search results for ${query} at FixToday`} />
        </Head>

        {loading && products.length === 0 ? (
          <>
            <Navbar />
            <div className="min-h-screen flex items-center justify-center pt-20">
              <Loader size="large" />
            </div>
            <CartDrawer />
          </>
        ) : (
          <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="container mx-auto px-4 pt-[140px] pb-12">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                  <FaSearch className="text-blue-600" />
                  <span>
                    {query ? `Results for "${query}"` : 'Search Products'}
                  </span>
                  <span className="text-sm font-normal text-gray-400">
                    ({products.length} items found)
                  </span>
                </h1>
                {products.length === 0 && query && (
                  <p className="text-gray-500 mt-2">
                    No products found matching your search. Try different keywords.
                  </p>
                )}
              </div>

              <ProductGrid
                products={products}
                loading={loading}
                hasMore={hasMore}
                onLoadMore={loadMore}
              />
            </main>

            <CartDrawer />
          </div>
        )}
      </CartProvider>
    </WishlistProvider>
  );
}