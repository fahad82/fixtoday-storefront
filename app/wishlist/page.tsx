// app/wishlist/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaTrash, FaShoppingCart, FaHeart, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/types/product.types';

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, addToCart } = useCart();
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  const formatPrice = (price: number | undefined | null): string => {
    if (price === undefined || price === null || isNaN(price)) return '0.00';
    return Number(price).toFixed(2);
  };

  // Helper function to add wishlist item to cart
  const handleAddToCart = async (item: any) => {
    const itemId = item.productId || item.id;
    setAddingToCart(itemId);
    
    try {
      // Log the original wishlist item for debugging
      console.log('🔍 Wishlist Item:', item);
      console.log('💰 Price from wishlist:', item.price);
      console.log('💰 Original price from wishlist:', item.originalPrice);
      
      // Ensure we're using the correct price
      const currentPrice = item.price != null ? Number(item.price) : 0;
      const originalPrice = item.originalPrice != null ? Number(item.originalPrice) : undefined;
      
      // Create a proper Product object with correct pricing
      const productToAdd: Product = {
        id: item.productId || item.id,
        name: item.name || 'Product',
        slug: item.slug || '',
        sku: null,
        description: null,
        short_description: null,
        base_price: currentPrice, // Use the exact price from wishlist
        sale_price: originalPrice && originalPrice > currentPrice ? originalPrice : null,
        cost_price: null,
        track_inventory: false,
        inventory_management: 'simple',
        stock_quantity: 999,
        low_stock_threshold: 0,
        brand_id: null,
        category_id: null,
        collection_ids: [],
        main_image: item.image || null,
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
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      console.log('📦 Product to add to cart:', productToAdd);
      console.log('💰 Price being sent to cart:', productToAdd.base_price);
      
      // Add to cart with quantity 1
      addToCart(productToAdd, 1);
      
      // Verify the price was added correctly
      setTimeout(() => {
        console.log('✅ Product added to cart successfully!');
      }, 100);
      
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
    } finally {
      setTimeout(() => setAddingToCart(null), 1000);
    }
  };

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaHeart className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Your Wishlist is Empty</h1>
            <p className="text-gray-500 mb-8">Save your favorite items here for later</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all hover:shadow-xl"
            >
              <FaArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-10">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4 transition-colors"
          >
            <FaArrowLeft className="w-3 h-3" />
            <span className="text-sm">Back to Products</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
              <FaHeart className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-gray-500 text-sm">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
          </div>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => {
            // Safely extract and convert prices
            const price = item.price != null ? Number(item.price) : 0;
            const originalPrice = item.originalPrice != null ? Number(item.originalPrice) : undefined;
            const hasDiscount = originalPrice && originalPrice > price;
            const discountPercent = hasDiscount 
              ? Math.round(((originalPrice - price) / originalPrice) * 100) 
              : 0;
            
            const isAdding = addingToCart === (item.productId || item.id);

            return (
              <div 
                key={item.id || item.productId} 
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100"
              >
                {/* Product Image */}
                <Link href={`/product/${item.slug || item.productId}`} className="block relative">
                  <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name || 'Product'}
                        fill
                        className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <span className="text-5xl block mb-2">📱</span>
                          <span className="text-sm text-gray-400">No Image</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Discount Badge */}
                    {hasDiscount && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        -{discountPercent}%
                      </div>
                    )}
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-5">
                  <Link href={`/product/${item.slug || item.productId}`}>
                    <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 min-h-[3rem] mb-3">
                      {item.name || 'Unnamed Product'}
                    </h3>
                  </Link>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-xl font-bold text-gray-900">
                      £{formatPrice(price)}
                    </span>
                    {originalPrice && originalPrice > price && (
                      <span className="text-sm text-gray-400 line-through">
                        £{formatPrice(originalPrice)}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={isAdding}
                      className="flex-1 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAdding ? (
                        <>
                          <FaSpinner className="w-4 h-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <FaShoppingCart className="w-4 h-4" />
                          Add to Cart
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.productId || item.id)}
                      className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                      title="Remove from wishlist"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}