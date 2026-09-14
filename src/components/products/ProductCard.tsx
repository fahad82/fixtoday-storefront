// src/components/products/ProductCard.tsx
"use client";

import React, { useState, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { Product } from '../../types';
import { 
  FaHeart, FaRegHeart, FaStar, FaStarHalfAlt, 
  FaShoppingCart, FaBolt, FaCheckCircle,
  FaClock, FaTruck
} from 'react-icons/fa';
import { IoMdCheckmark } from 'react-icons/io';
import toast from 'react-hot-toast';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact' | 'featured' | 'grid';
  priority?: boolean;
}

export const ProductCard = memo(({ 
  product, 
  variant = 'default',
  priority = false 
}: ProductCardProps) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const isWishlisted = isInWishlist(product.id);
  const hasSale = product.sale_price !== null && Number(product.sale_price) < Number(product.base_price);
  const discount = hasSale ? Math.round((1 - (Number(product.sale_price) || 0) / Number(product.base_price)) * 100) : 0;
  const inStock = Number(product.stock_quantity) > 0;
  const isOutOfStock = product.status === 'out_of_stock' || !inStock;
  const isLowStock = inStock && Number(product.stock_quantity) <= 5;

  const rating = 4.5;
  const reviewCount = Math.floor(Math.random() * 200) + 50;

  const imageUrl = product.main_image && !imageError ? product.main_image : FALLBACK_IMAGE;

  const handleAddToCart = async (e: React.MouseEvent): Promise<void> => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || isAddingToCart) return;

    setIsAddingToCart(true);
    try {
      await addToCart(product);
      toast.success(`${product.name} added to cart!`, {
        icon: '🛒',
        duration: 3000,
      });
    } catch (error) {
      toast.error('Failed to add to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    if (!isWishlisted) {
      toast.success(`${product.name} added to wishlist!`, {
        icon: '❤️',
        duration: 2000,
      });
    } else {
      toast.success(`${product.name} removed from wishlist!`, {
        icon: '💔',
        duration: 2000,
      });
    }
  };

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
  }).format(price);
};

  const renderStars = (rating: number): React.ReactNode => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`star-${i}`} className="text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half-star" className="text-yellow-400" />);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-star-${i}`} className="text-gray-200" />);
    }

    return stars;
  };

  // Compact variant
  if (variant === 'compact') {
    return (
      <Link href={`/product/${product.slug}`} className="block group">
        <div className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-xl transition-all">
          <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="64px"
              onError={() => setImageError(true)}
              unoptimized={imageUrl.startsWith('http')}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-sm font-bold text-blue-600">
                {formatPrice(Number(product.sale_price) || Number(product.base_price) || 0)}
              </span>
              {hasSale && (
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(Number(product.base_price) || 0)}
                </span>
              )}
            </div>
          </div>
          {/* Wishlist button for compact view */}
          <button
            onClick={handleToggleWishlist}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {isWishlisted ? (
              <FaHeart className="text-red-500 text-lg" />
            ) : (
              <FaRegHeart className="text-gray-400 hover:text-red-500 text-lg" />
            )}
          </button>
        </div>
      </Link>
    );
  }

  // Featured variant
  if (variant === 'featured') {
    return (
      <div className="group bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 relative">
        <Link href={`/product/${product.slug}`} className="block relative aspect-[4/3] overflow-hidden bg-gray-50">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            onError={() => setImageError(true)}
            unoptimized={imageUrl.startsWith('http')}
            priority={priority}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-white font-bold text-lg line-clamp-2">{product.name}</h3>
            <div className="flex items-center space-x-3 mt-2">
              <span className="text-white text-xl font-bold">
                {formatPrice(Number(product.sale_price) || Number(product.base_price) || 0)}
              </span>
              {hasSale && (
                <span className="text-white/60 line-through text-sm">
                  {formatPrice(Number(product.base_price) || 0)}
                </span>
              )}
            </div>
          </div>
        </Link>
        {/* Wishlist button for featured view */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-4 right-4 z-10 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {isWishlisted ? (
            <FaHeart className="text-red-500 text-lg" />
          ) : (
            <FaRegHeart className="text-gray-600 hover:text-red-500 text-lg" />
          )}
        </button>
      </div>
    );
  }

  // Default/Grid variant
  return (
    <motion.div 
      className="group bg-white rounded-2xl overflow-hidden transition-all duration-300 border border-gray-100/50 hover:shadow-xl hover:border-blue-200 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image Container */}
      <Link href={`/product/${product.slug}`} className="block relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className={`object-contain transition-transform duration-700 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          onError={() => setImageError(true)}
          unoptimized={imageUrl.startsWith('http')}
          priority={priority}
        />
        
        {/* Quick Action Overlay */}
        <motion.div 
          className={`absolute inset-0 bg-black/5 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {hasSale && discount > 0 && (
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center space-x-1"
            >
              <FaBolt className="text-[10px]" />
              <span>{discount}% OFF</span>
            </motion.div>
          )}
          {isLowStock && !isOutOfStock && (
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="px-3 py-1.5 bg-amber-500 text-white text-[10px] font-semibold rounded-full shadow-lg flex items-center space-x-1"
            >
              <FaClock className="text-[10px]" />
              <span>Low Stock</span>
            </motion.div>
          )}
          {product.featured && (
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-semibold rounded-full shadow-lg flex items-center space-x-1"
            >
              <FaCheckCircle className="text-[10px]" />
              <span>Featured</span>
            </motion.div>
          )}
        </div>

        {/* In Stock Badge */}
        {!isOutOfStock && (
          <div className="absolute top-3 right-3 z-10 px-2.5 py-1 bg-green-500/90 text-white text-[10px] font-medium rounded-full shadow-lg flex items-center space-x-1 backdrop-blur-sm">
            <IoMdCheckmark className="text-xs" />
            <span>In Stock</span>
          </div>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 z-10 bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <motion.span 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="px-6 py-3 bg-white/95 text-gray-800 font-bold text-sm rounded-xl shadow-lg"
            >
              Out of Stock
            </motion.span>
          </div>
        )}

        {/* Wishlist Button - Always Visible */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 z-20 p-2.5 rounded-full shadow-lg transition-all duration-300 ${
            isWishlisted 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-white/90 hover:bg-white text-gray-600 hover:text-red-500 backdrop-blur-sm'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {isWishlisted ? (
            <FaHeart className="text-sm" />
          ) : (
            <FaRegHeart className="text-sm" />
          )}
        </button>

        {/* Hover Add to Cart Button */}
        <motion.div 
          className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 via-black/30 to-transparent transition-all duration-300 ${
            isHovered && !isOutOfStock ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAddingToCart}
            className={`w-full py-2.5 rounded-xl font-medium transition-all flex items-center justify-center space-x-2 text-sm ${
              isOutOfStock
                ? 'bg-gray-400/80 text-gray-200 cursor-not-allowed'
                : isAddingToCart
                ? 'bg-blue-400/80 text-white cursor-wait'
                : 'bg-white/95 text-blue-600 hover:bg-white backdrop-blur-sm shadow-lg'
            }`}
          >
            <FaShoppingCart className="text-sm" />
            <span>
              {isOutOfStock ? 'Out of Stock' : isAddingToCart ? 'Adding...' : 'Add to Cart'}
            </span>
          </motion.button>
        </motion.div>
      </Link>

      {/* Product Info */}
      <div className="p-4 space-y-2">
        {/* Brand */}
        {product.brand_name && (
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
            {product.brand_name}
          </p>
        )}

        {/* Product Name */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 text-sm leading-relaxed">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center space-x-1.5">
          <div className="flex text-[10px]">{renderStars(rating)}</div>
          <span className="text-xs font-medium text-gray-600">{rating}</span>
          <span className="text-xs text-gray-400">({reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-blue-600">
              {formatPrice(Number(product.sale_price) || Number(product.base_price) || 0)}
            </span>
            {hasSale && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(Number(product.base_price) || 0)}
              </span>
            )}
          </div>
          
          {/* Free Shipping Badge */}
          <div className="flex items-center space-x-1 text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            <FaTruck className="text-[10px]" />
            <span>Free Ship</span>
          </div>
        </div>

        {/* Mobile Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAddingToCart}
          className={`w-full md:hidden py-2.5 rounded-xl font-medium transition-all flex items-center justify-center space-x-2 text-sm mt-2 ${
            isOutOfStock
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : isAddingToCart
              ? 'bg-blue-400 text-white cursor-wait'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg active:scale-95'
          }`}
        >
          <FaShoppingCart className="text-sm" />
          <span>
            {isOutOfStock ? 'Out of Stock' : isAddingToCart ? 'Adding...' : 'Add to Cart'}
          </span>
        </button>
      </div>
    </motion.div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;