// app/wishlist/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaTrash, FaShoppingCart, FaHeart } from 'react-icons/fa';
import { useCart } from '@/contexts/CartContext';

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, addToCart } = useCart();

  const formatPrice = (price: number): string => {
    return price.toFixed(2);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">💔</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Your wishlist is empty</h1>
            <p className="text-gray-600 mb-6">Save your favorite items here</p>
            <Link
              href="/products"
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <FaHeart className="w-8 h-8 text-red-500" />
          <h1 className="text-3xl font-bold text-gray-800">My Wishlist</h1>
          <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
            {wishlistItems.length} items
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
              {/* Product Image */}
              <Link href={`/product/${item.slug}`}>
                <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl">📱</span>
                    </div>
                  )}
                </div>
              </Link>

              {/* Product Info */}
              <div className="p-4">
                <Link href={`/product/${item.slug}`}>
                  <h3 className="font-semibold text-gray-800 hover:text-blue-600 transition-colors line-clamp-2 min-h-[56px]">
                    {item.name}
                  </h3>
                </Link>

                {/* Price */}
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-blue-600">
                    £{formatPrice(item.price)}
                  </span>
                  {item.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      £{formatPrice(item.originalPrice)}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => {
                      addToCart({ ...item, base_price: item.price, sale_price: item.originalPrice, main_image: item.image } as any, 1);
                    }}
                    className="flex-1 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <FaShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item.productId)}
                    className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}