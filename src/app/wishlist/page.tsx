// src/app/wishlist/page.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/common/Navbar';
import CartDrawer from '../../components/cart/CartDrawer';
import ProductCard from '../../components/products/ProductCard';
import { useWishlist } from '../../hooks/useWishlist';
import { useCart } from '../../hooks/useCart';
import { 
  FaHeart, 
  FaShoppingCart, 
  FaTrash, 
  FaArrowLeft,
  FaRegHeart,
  FaShareAlt,
  FaDownload
} from 'react-icons/fa';
import { Product } from '../../types';
import toast from 'react-hot-toast';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState<string | null>(null);

  const handleAddToCart = async (product: Product) => {
    setIsAdding(product.id);
    try {
      await addToCart(product);
      toast.success(`${product.name} added to cart!`, {
        icon: '🛒',
        duration: 3000,
      });
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setIsAdding(null);
    }
  };

  const handleRemoveFromWishlist = async (id: string, name: string) => {
    setIsRemoving(id);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      removeFromWishlist(id);
      toast.success(`${name} removed from wishlist`, {
        icon: '💔',
        duration: 2000,
      });
    } catch (error) {
      toast.error('Failed to remove from wishlist');
    } finally {
      setIsRemoving(null);
    }
  };

  const handleClearAll = async () => {
    if (wishlist.length === 0) return;
    if (window.confirm('Are you sure you want to remove all items from your wishlist?')) {
      clearWishlist();
      toast.success('Wishlist cleared', { icon: '🗑️' });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Wishlist - FixToday',
        text: 'Check out my wishlist on FixToday!',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!', { icon: '📋' });
    }
  };

  // Empty State
  if (wishlist.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-[80vh] bg-white flex items-center justify-center pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-lg px-6"
          >
            <div className="relative inline-block">
              <div className="text-8xl mb-6">❤️</div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-ping" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              Start adding your favorite products to your wishlist and come back later!
            </p>
            <Link
              href="/"
              className="inline-flex items-center space-x-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-xl hover:shadow-blue-200 transition-all transform hover:scale-105"
            >
              <FaArrowLeft className="text-sm" />
              <span>Start Shopping</span>
            </Link>
          </motion.div>
        </div>
        <CartDrawer />
      </>
    );
  }

  // Calculate total price
  const totalPrice = wishlist.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        <main className="container mx-auto px-4 pt-[120px] pb-16">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-50 via-white to-indigo-50 rounded-3xl p-6 md:p-8 mb-8 border border-gray-100">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start md:items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center shadow-lg shadow-red-200">
                  <FaHeart className="text-white text-2xl" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    My Wishlist
                  </h1>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-sm text-gray-500">
                      {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
                    </span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span className="text-sm text-gray-500">
                      Total: <span className="font-semibold text-gray-900">${totalPrice.toFixed(2)}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 w-full md:w-auto">
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all text-sm font-medium text-gray-700"
                >
                  <FaShareAlt className="text-gray-400" />
                  <span className="hidden sm:inline">Share</span>
                </button>
                {wishlist.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="flex items-center space-x-2 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-all text-sm font-medium text-red-600"
                  >
                    <FaTrash className="text-xs" />
                    <span className="hidden sm:inline">Clear All</span>
                  </button>
                )}
                <Link
                  href="/"
                  className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-200 transition-all text-sm font-medium"
                >
                  <FaArrowLeft className="text-xs" />
                  <span>Continue Shopping</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Wishlist Items Grid */}
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {wishlist.map((item, index) => {
                const product: Product = {
                  id: item.id,
                  name: item.name,
                  slug: item.slug,
                  sku: null,
                  description: null,
                  short_description: null,
                  base_price: Number(item.price) || 0,
                  sale_price: null,
                  cost_price: null,
                  stock_quantity: 10,
                  low_stock_threshold: 5,
                  track_inventory: true,
                  inventory_management: 'simple',
                  brand_id: null,
                  category_id: null,
                  collection_ids: [],
                  main_image: item.image,
                  main_image_public_id: null,
                  gallery_images: [],
                  has_variants: false,
                  variant_options: [],
                  variants: [],
                  specifications: [],
                  seo: { metaTitle: null, metaDescription: null, keywords: [] },
                  status: 'active',
                  featured: false,
                  sort_order: 0,
                  weight: null,
                  weight_unit: 'kg',
                  dimensions: { length: 0, width: 0, height: 0 },
                  view_count: 0,
                  sale_count: 0,
                  created_at: item.addedAt || new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                };

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="relative group"
                  >
                    <ProductCard product={product} />
                    
                    {/* Remove Button - Top Left */}
                    <button
                      onClick={() => handleRemoveFromWishlist(item.id, item.name)}
                      disabled={isRemoving === item.id}
                      className="absolute top-3 left-3 z-20 p-2.5 bg-white/95 backdrop-blur-sm text-red-500 rounded-xl shadow-lg hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50 disabled:cursor-wait border border-red-100"
                      aria-label="Remove from wishlist"
                    >
                      {isRemoving === item.id ? (
                        <span className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin block" />
                      ) : (
                        <FaTrash className="text-xs" />
                      )}
                    </button>

                    {/* Add to Cart Button - Bottom Right */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={isAdding === item.id}
                      className="absolute bottom-4 right-4 z-20 p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50 disabled:cursor-wait transform hover:scale-105"
                      aria-label="Add to cart"
                    >
                      {isAdding === item.id ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin block" />
                      ) : (
                        <FaShoppingCart className="text-sm" />
                      )}
                    </button>

                    {/* Quick Action Label - Shows on hover */}
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <p className="text-white text-xs font-medium text-center">
                        Click to add to cart
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>

          {/* Bottom Actions */}
          {wishlist.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">
                    Showing <span className="font-semibold text-gray-900">{wishlist.length}</span> items
                  </span>
                  <span className="w-px h-6 bg-gray-200" />
                  <span className="text-sm text-gray-500">
                    Total: <span className="font-bold text-gray-900 text-lg">${totalPrice.toFixed(2)}</span>
                  </span>
                </div>
                <Link
                  href="/"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-xl font-medium hover:bg-blue-600 hover:text-white transition-all transform hover:scale-105"
                >
                  <FaArrowLeft className="text-sm" />
                  <span>Continue Shopping</span>
                </Link>
              </div>
            </div>
          )}
        </main>
        <CartDrawer />
      </div>
    </>
  );
}