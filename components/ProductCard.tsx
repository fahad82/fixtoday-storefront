// components/ProductCard.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaShoppingCart, FaRegHeart, FaStar, FaStarHalfAlt, FaHeart, FaCheck } from 'react-icons/fa';
import { Product } from '@/types/product.types';
import { useCart } from '@/contexts/CartContext'; 



interface ProductCardProps { 
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  
  const { id, name, slug, base_price, sale_price, main_image, status, stock_quantity } = product;
  
  // Safe price conversion
  const basePrice = base_price != null ? Number(base_price) : 0;
  const salePrice = sale_price != null ? Number(sale_price) : null;
  
  const finalPrice = salePrice || basePrice;
  const originalPrice = salePrice ? basePrice : null;
  const discount = originalPrice ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100) : 0;
  
  // Safe format price function
  const formatPrice = (price: number | null | undefined): string => {
    if (price == null || isNaN(price)) return '0.00';
    return Number(price).toFixed(2);
  };
  
  const isOutOfStock = status === 'out_of_stock' || stock_quantity === 0;
  const isLowStock = !isOutOfStock && (stock_quantity || 0) < 10 && (stock_quantity || 0) > 0;
  
  // Rating (default to 4.5 if not provided)
  const rating = (product as any).rating || 4.5;
  const reviews = (product as any).reviews || 0;
  const wished = isInWishlist(id);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (wished) {
      removeFromWishlist(id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(product, 1);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  return (
    <div 
      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Discount Badge */}
      {discount > 0 && (
        <div className="absolute top-3 left-3 z-10 bg-red-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg">
          -{discount}%
        </div>
      )}
      
      {/* Wishlist Button */}
      <button
        onClick={handleWishlist}
        className="absolute top-3 right-3 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-red-50 transition-all duration-200 shadow-sm"
        title={wished ? "Remove from wishlist" : "Add to wishlist"}
      >
        {wished ? (
          <FaHeart className="w-4 h-4 text-red-500" />
        ) : (
          <FaRegHeart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
        )}
      </button>

      {/* Product Image */}
      <Link href={`/product/${slug || id}`} className="block overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="relative h-64 w-full">
          {main_image && !imageError ? (
            <Image
              src={main_image}
              alt={name}
              fill
              className={`object-contain p-4 transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => setImageError(true)}
              unoptimized={process.env.NODE_ENV === 'development'}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <span className="text-5xl block mb-2">📱</span>
                <span className="text-gray-400 text-sm">No Image</span>
              </div>
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link href={`/product/${slug || id}`}>
          <h3 className="font-semibold text-gray-800 hover:text-gray-600 transition-colors line-clamp-2 min-h-[56px]">
            {name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center text-amber-400">
            {[...Array(5)].map((_, i) => {
              const starValue = i + 1;
              if (starValue <= Math.floor(rating)) {
                return <FaStar key={i} className="w-3.5 h-3.5" />;
              } else if (starValue - 0.5 <= rating) {
                return <FaStarHalfAlt key={i} className="w-3.5 h-3.5" />;
              } else {
                return <FaStar key={i} className="w-3.5 h-3.5 text-gray-200" />;
              }
            })}
          </div>
          <span className="text-xs text-gray-400">({reviews})</span>
        </div>

        {/* Price */}
        <div className="mt-3 flex items-baseline gap-2 flex-wrap">
          <span className="text-2xl font-bold text-gray-900">
            £{formatPrice(finalPrice)}
          </span>
          {originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              £{formatPrice(originalPrice)}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className="mt-2">
          {isOutOfStock ? (
            <span className="text-xs text-red-500 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="text-xs text-orange-500 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></span>
              Only {stock_quantity} left
            </span>
          ) : (
            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
              In Stock
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || addedToCart}
          className={`mt-4 w-full py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 text-sm ${
            isOutOfStock
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : addedToCart
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg active:scale-95'
          }`}
        >
          {addedToCart ? (
            <>
              <FaCheck className="w-4 h-4" />
              Added!
            </>
          ) : (
            <>
              <FaShoppingCart className="w-4 h-4" />
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

