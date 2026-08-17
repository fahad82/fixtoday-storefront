// src/components/product/ProductDetailClient.tsx
"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { Product } from '@/types';
import { 
  FaStar, FaStarHalfAlt, FaHeart, FaRegHeart, FaMinus, FaPlus, 
  FaShoppingCart, FaTruck, FaUndo, FaShieldAlt, FaShareAlt, 
  FaChevronRight, FaExclamationTriangle, FaCheckCircle, 
  FaArrowRight, FaBolt, FaAward, FaClock, FaGem, 
  FaShippingFast, FaHeadset, FaThumbsUp, FaInfoCircle,
  FaExpand, FaCompress
} from 'react-icons/fa';
import { FiZoomIn, FiCheck } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode, Thumbs } from 'swiper/modules';
import toast from 'react-hot-toast';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop';

interface VariantOption {
  id: string;
  name: string;
  display_name: string;
  values: string[];
}

interface Variant {
  id: string;
  sku: string;
  name: string;
  image: string | null;
  gallery_images: string[];
  price: number;
  sale_price: number | null;
  stock_quantity: number;
  attributes: Record<string, string>;
  status: 'active' | 'inactive' | 'out_of_stock';
  is_default: boolean;
}

interface Specification {
  name: string;
  value: string;
}

interface ProductDetailClientProps {
  initialProduct: Product;
  relatedProducts?: Product[];
}

export default function ProductDetailClient({ 
  initialProduct, 
  relatedProducts = [] 
}: ProductDetailClientProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews' | 'shipping'>('description');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isSticky, setIsSticky] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const mainImageRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  // Find default variant
  useEffect(() => {
    if (initialProduct.has_variants && initialProduct.variants?.length) {
      const defaultVariant = (initialProduct.variants as Variant[]).find(v => v.is_default) || initialProduct.variants[0];
      setSelectedVariant(defaultVariant as Variant);
      
      const opts: Record<string, string> = {};
      if (initialProduct.variant_options) {
        (initialProduct.variant_options as VariantOption[]).forEach((opt) => {
          const val = (defaultVariant as Variant)?.attributes?.[opt.name];
          if (val) opts[opt.name] = val;
        });
      }
      setSelectedOptions(opts);
    }
  }, [initialProduct]);

  // Pricing & Stock Computations
  const pricingAndStock = useMemo(() => {
    const price = selectedVariant?.sale_price || selectedVariant?.price || initialProduct.sale_price || initialProduct.base_price || 0;
    const origPrice = selectedVariant?.price || initialProduct.base_price || 0;
    const hasSale = Boolean(
      (selectedVariant?.sale_price && selectedVariant.sale_price < selectedVariant.price) || 
      (initialProduct.sale_price && initialProduct.sale_price < initialProduct.base_price)
    );
    const discount = hasSale && origPrice > 0 ? Math.round((1 - Number(price) / Number(origPrice)) * 100) : 0;
    const stock = selectedVariant ? selectedVariant.stock_quantity : (initialProduct.stock_quantity || 0);
    const isOutOfStock = initialProduct.status === 'out_of_stock' || stock <= 0;
    const isLowStock = stock > 0 && stock <= 5;

    return { 
      currentPrice: Number(price), 
      originalPrice: Number(origPrice), 
      discount, 
      hasSale, 
      stock, 
      isOutOfStock, 
      isLowStock 
    };
  }, [initialProduct, selectedVariant]);

  // Gallery Images
  const allGalleryImages = useMemo(() => {
    const list = [
      initialProduct.main_image,
      ...(initialProduct.gallery_images || []),
      ...(selectedVariant?.image ? [selectedVariant.image] : []),
      ...(selectedVariant?.gallery_images || []),
    ].filter((img): img is string => Boolean(img));
    return list.length > 0 ? list : [FALLBACK_IMAGE];
  }, [initialProduct, selectedVariant]);

  const activeImage = useMemo(() => {
    return allGalleryImages[currentImageIndex] || allGalleryImages[0] || FALLBACK_IMAGE;
  }, [allGalleryImages, currentImageIndex]);

  // Sticky add to cart
  useEffect(() => {
    const handleScroll = () => {
      if (stickyRef.current) {
        const rect = stickyRef.current.getBoundingClientRect();
        setIsSticky(rect.bottom < 0);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (pricingAndStock.stock || 10)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (pricingAndStock.isOutOfStock || isAddingToCart) return;

    setIsAddingToCart(true);
    try {
      const itemToAdd = {
        ...initialProduct,
        ...(selectedVariant && {
          id: selectedVariant.id,
          sku: selectedVariant.sku,
          sale_price: selectedVariant.sale_price || selectedVariant.price,
          base_price: selectedVariant.price,
          stock_quantity: selectedVariant.stock_quantity,
          main_image: selectedVariant.image || initialProduct.main_image,
        }),
      };
      await addToCart(itemToAdd, quantity, selectedOptions);
      toast.success(`${quantity} item(s) added to cart!`, {
        icon: '🛒',
        duration: 3000,
      });
    } catch (err) {
      toast.error('Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      toast.success('Link copied!');
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleOptionSelect = (optionName: string, value: string) => {
    const nextOptions = { ...selectedOptions, [optionName]: value };
    setSelectedOptions(nextOptions);

    if (initialProduct.variants) {
      const match = (initialProduct.variants as Variant[]).find((v) =>
        Object.entries(nextOptions).every(([k, val]) => v.attributes?.[k] === val)
      );

      if (match) {
        setSelectedVariant(match);
        const matchIndex = allGalleryImages.indexOf(match.image || '');
        if (matchIndex !== -1) setCurrentImageIndex(matchIndex);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mainImageRef.current) return;
    const { left, top, width, height } = mainImageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x: Math.min(100, Math.max(0, x)), y: Math.min(100, Math.max(0, y)) });
  };

  const isWishlisted = isInWishlist(initialProduct.id);
  const ratingScore = 4.8;
  const totalReviews = 142;

  const premiumFeatures = [
    { icon: FaShippingFast, label: 'Free Express Shipping', desc: '2-3 business days' },
    { icon: FaUndo, label: '30-Day Returns', desc: 'Hassle-free returns' },
    { icon: FaShieldAlt, label: '2-Year Warranty', desc: 'Full coverage' },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  return (
    <>
      {/* Sticky Add to Cart Bar */}
      <AnimatePresence>
        {isSticky && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100"
          >
            <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    src={activeImage}
                    alt={initialProduct.name}
                    fill
                    className="object-cover"
                    unoptimized={activeImage.startsWith('http')}
                  />
                </div>
                <div>
                  <h3 className="font-medium text-sm line-clamp-1 text-gray-800">{initialProduct.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-base font-bold text-blue-600">
                      {formatPrice(pricingAndStock.currentPrice)}
                    </span>
                    {pricingAndStock.hasSale && (
                      <span className="text-xs text-gray-400 line-through">
                        {formatPrice(pricingAndStock.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center disabled:opacity-40 text-xs"
                  >
                    <FaMinus className="text-[10px]" />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= pricingAndStock.stock}
                    className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center disabled:opacity-40 text-xs"
                  >
                    <FaPlus className="text-[10px]" />
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={pricingAndStock.isOutOfStock || isAddingToCart}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-12 pb-10" ref={stickyRef}>
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs text-gray-500 mb-6 overflow-x-auto whitespace-nowrap pb-1">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <FaChevronRight className="text-[8px] text-gray-300 flex-shrink-0" />
          {initialProduct.category_name && (
            <>
              <Link href={`/category/${initialProduct.category_id}`} className="hover:text-blue-600 transition-colors">
                {initialProduct.category_name}
              </Link>
              <FaChevronRight className="text-[8px] text-gray-300 flex-shrink-0" />
            </>
          )}
          <span className="text-gray-700 font-medium truncate">{initialProduct.name}</span>
        </nav>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          
          {/* Gallery Column */}
          <div className="space-y-4">
            {/* Main Image */}
            <div 
              ref={mainImageRef}
              className="relative aspect-square w-full bg-gray-50 rounded-xl overflow-hidden border border-gray-200 cursor-crosshair group"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <Image
                src={activeImage}
                alt={initialProduct.name}
                fill
                priority
                className={`object-contain transition-opacity duration-300 ${isZoomed ? 'opacity-0' : 'opacity-100'}`}
                sizes="(max-width: 1024px) 100vw, 50vw"
                unoptimized={activeImage.startsWith('http')}
              />
              {isZoomed && (
                <div
                  className="absolute inset-0 bg-no-repeat pointer-events-none transition-opacity duration-200"
                  style={{
                    backgroundImage: `url(${activeImage})`,
                    backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                    backgroundSize: '250%',
                  }}
                />
              )}

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                {pricingAndStock.hasSale && pricingAndStock.discount > 0 && (
                  <div className="px-3 py-1 bg-gradient-to-r from-rose-500 to-amber-500 text-white text-[10px] font-bold rounded-full shadow-lg flex items-center space-x-1">
                    <FaBolt className="text-[10px]" />
                    <span>SAVE {pricingAndStock.discount}%</span>
                  </div>
                )}
                {initialProduct.featured && (
                  <div className="px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-semibold rounded-full shadow-lg flex items-center space-x-1">
                    <FaAward className="text-[10px]" />
                    <span>PREMIUM</span>
                  </div>
                )}
                {pricingAndStock.isLowStock && !pricingAndStock.isOutOfStock && (
                  <div className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-semibold rounded-full shadow-lg flex items-center space-x-1">
                    <FaClock className="text-[10px]" />
                    <span>Only {pricingAndStock.stock} Left</span>
                  </div>
                )}
              </div>

              {/* Zoom indicator */}
              <div className="absolute bottom-3 right-3 z-10 hidden sm:flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] font-medium text-gray-600 shadow-lg border border-gray-200">
                <FiZoomIn className="text-sm text-blue-600" />
                <span>Zoom</span>
              </div>

              {/* Fullscreen button */}
              <button
                onClick={() => setIsImageModalOpen(true)}
                className="absolute bottom-3 left-3 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 group"
              >
                <FaExpand className="text-gray-600 group-hover:text-blue-600 transition-colors text-sm" />
              </button>
            </div>

            {/* Thumbnails */}
            {allGalleryImages.length > 1 && (
              <div className="relative">
                <Swiper
                  onSwiper={setThumbsSwiper}
                  spaceBetween={8}
                  slidesPerView={5}
                  freeMode={true}
                  watchSlidesProgress={true}
                  modules={[FreeMode, Navigation, Thumbs]}
                  className="thumbnails-swiper"
                  breakpoints={{
                    320: { slidesPerView: 4 },
                    640: { slidesPerView: 5 },
                    1024: { slidesPerView: 6 },
                  }}
                >
                  {allGalleryImages.map((imgUrl, idx) => (
                    <SwiperSlide key={idx}>
                      <button
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`relative w-full aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                          currentImageIndex === idx 
                            ? 'border-blue-600 ring-2 ring-blue-500/20' 
                            : 'border-gray-200 hover:border-gray-400 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <Image
                          src={imgUrl}
                          alt={`${initialProduct.name} preview ${idx + 1}`}
                          fill
                          className="object-cover"
                          sizes="80px"
                          unoptimized={imgUrl.startsWith('http')}
                        />
                      </button>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col space-y-4">
            {/* Brand and Share */}
            <div className="flex items-center justify-between">
              {initialProduct.brand_name ? (
                <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                  {initialProduct.brand_logo && (
                    <div className="relative w-5 h-5">
                      <Image
                        src={initialProduct.brand_logo}
                        alt={initialProduct.brand_name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                  <span className="text-[10px] font-bold tracking-wider text-blue-600 uppercase">
                    {initialProduct.brand_name}
                  </span>
                </div>
              ) : <div />}
              
              <button 
                onClick={handleShare}
                className="flex items-center space-x-1.5 text-xs text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-all duration-200"
              >
                <FaShareAlt className="text-gray-400 text-xs" />
                <span>{copiedLink ? 'Copied!' : 'Share'}</span>
              </button>
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
              {initialProduct.name}
            </h1>

            {/* Short Description */}
            {initialProduct.short_description && (
              <p className="text-sm text-gray-600 leading-relaxed">
                {initialProduct.short_description}
              </p>
            )}

            {/* Rating */}
            <div className="flex items-center space-x-2 text-sm pb-2 border-b border-gray-100">
              <div className="flex items-center space-x-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-xs" />
                ))}
              </div>
              <span className="font-semibold text-gray-800 text-sm">{ratingScore}</span>
              <span className="text-gray-300">•</span>
              <button onClick={() => setActiveTab('reviews')} className="text-blue-600 hover:underline text-xs font-medium">
                {totalReviews} reviews
              </button>
              <span className="text-gray-300">•</span>
              <div className="flex items-center space-x-1 text-emerald-600">
                <FaThumbsUp className="text-[10px]" />
                <span className="text-[10px] font-medium">98%</span>
              </div>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline space-x-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                {formatPrice(pricingAndStock.currentPrice)}
              </span>
              {pricingAndStock.hasSale && (
                <span className="text-base text-gray-400 line-through font-medium">
                  {formatPrice(pricingAndStock.originalPrice)}
                </span>
              )}
              {pricingAndStock.hasSale && pricingAndStock.discount > 0 && (
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                  -{pricingAndStock.discount}%
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2 text-xs font-semibold">
              {pricingAndStock.isOutOfStock ? (
                <div className="flex items-center space-x-1.5 text-rose-600 bg-rose-50 px-3 py-1.5 rounded-full">
                  <FaExclamationTriangle className="text-[10px]" />
                  <span>Out of Stock</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1.5 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full">
                  <FaCheckCircle className="text-[10px] text-emerald-500" />
                  <span>In Stock</span>
                  {pricingAndStock.stock > 0 && (
                    <span className="text-gray-500 font-normal text-[10px]">
                      ({pricingAndStock.stock} available)
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Variant Selectors */}
            {initialProduct.has_variants && (initialProduct.variant_options as VariantOption[])?.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-gray-100">
                {(initialProduct.variant_options as VariantOption[]).map((opt) => {
                  const allValues = ((initialProduct.variants as Variant[]) || [])
                    .map((v) => v.attributes?.[opt.name])
                    .filter((val): val is string => Boolean(val));
                  const uniqueValues = [...new Set(allValues)];

                  return (
                    <div key={opt.id} className="space-y-1.5">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600">
                        {opt.display_name || opt.name}: <span className="text-blue-600 capitalize font-normal">{selectedOptions[opt.name] || 'Select'}</span>
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {uniqueValues.map((val) => {
                          const isSelected = selectedOptions[opt.name] === val;
                          return (
                            <button
                              key={val}
                              onClick={() => handleOptionSelect(opt.name, val)}
                              className={`px-3 py-1.5 text-xs font-medium rounded-lg border-2 transition-all duration-200 ${
                                isSelected
                                  ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                              }`}
                            >
                              {val}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quantity & Actions */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600">Qty</label>
                  <div className="inline-flex items-center border border-gray-200 rounded-lg bg-gray-50 p-0.5">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1 || pricingAndStock.isOutOfStock}
                      className="w-7 h-7 flex items-center justify-center rounded-md bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition-colors text-xs"
                    >
                      <FaMinus className="text-[10px]" />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold text-gray-900">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= pricingAndStock.stock || pricingAndStock.isOutOfStock}
                      className="w-7 h-7 flex items-center justify-center rounded-md bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition-colors text-xs"
                    >
                      <FaPlus className="text-[10px]" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 opacity-0">Actions</label>
                  <button
                    onClick={handleAddToCart}
                    disabled={pricingAndStock.isOutOfStock || isAddingToCart}
                    className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center space-x-2 shadow-md ${
                      pricingAndStock.isOutOfStock
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                        : isAddingToCart
                        ? 'bg-blue-400 text-white cursor-wait'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:scale-[1.02] text-white'
                    }`}
                  >
                    <FaShoppingCart className="text-sm" />
                    <span>
                      {pricingAndStock.isOutOfStock 
                        ? 'Out of Stock' 
                        : isAddingToCart 
                        ? 'Adding...' 
                        : 'Add to Cart'}
                    </span>
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 opacity-0">Wishlist</label>
                  <button
                    onClick={() => toggleWishlist(initialProduct)}
                    className={`p-2.5 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${
                      isWishlisted
                        ? 'border-rose-500 bg-rose-50 text-rose-500'
                        : 'border-gray-200 hover:border-rose-200 hover:bg-rose-50/50 text-gray-600'
                    }`}
                  >
                    {isWishlisted ? <FaHeart className="text-base" /> : <FaRegHeart className="text-base" />}
                  </button>
                </div>
              </div>

              {/* Guaranteed Delivery */}
              <div className="flex items-center space-x-2 text-[10px] text-emerald-600 bg-emerald-50/80 px-3 py-1.5 rounded-lg border border-emerald-200">
                <FaCheckCircle className="text-emerald-500 text-xs" />
                <span className="font-medium">Delivery by</span>
                <span className="font-bold">
                  {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </div>

            {/* Premium Features Grid */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
              {premiumFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="p-2.5 bg-gray-50 rounded-xl border border-gray-200 text-center hover:border-blue-200 transition-all duration-200"
                >
                  <feature.icon className="text-lg text-blue-600 mx-auto mb-0.5" />
                  <p className="text-[10px] font-semibold text-gray-700 leading-tight">{feature.label}</p>
                  <p className="text-[8px] text-gray-400 mt-0.5">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detail Tabs */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex border-b border-gray-200 gap-6 overflow-x-auto scrollbar-none mb-6">
            {[
              { id: 'description', label: 'Description', icon: FaInfoCircle },
              { id: 'specifications', label: 'Specifications', icon: FaGem },
              { id: 'reviews', label: `Reviews (${totalReviews})`, icon: FaStar },
              { id: 'shipping', label: 'Shipping', icon: FaShippingFast },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 text-sm font-medium transition-all relative whitespace-nowrap flex items-center space-x-1.5 ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="text-xs" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div className="text-sm text-gray-600 leading-relaxed">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">Product Overview</h3>
                  <p className="text-sm">
                    {initialProduct.description || 'No detailed description provided for this item yet.'}
                  </p>
                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-center space-x-2 text-sm">
                      <FaCheckCircle className="text-emerald-500 text-xs" />
                      <span>Premium quality materials</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <FaCheckCircle className="text-emerald-500 text-xs" />
                      <span>Expert craftsmanship</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <FaCheckCircle className="text-emerald-500 text-xs" />
                      <span>Satisfaction guarantee</span>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <h4 className="font-bold text-gray-900 text-sm mb-2">Why Choose This?</h4>
                  <ul className="space-y-1.5">
                    <li className="flex items-start space-x-2 text-sm">
                      <FaBolt className="text-blue-600 mt-0.5 text-xs" />
                      <span>Innovative design</span>
                    </li>
                    <li className="flex items-start space-x-2 text-sm">
                      <FaAward className="text-blue-600 mt-0.5 text-xs" />
                      <span>Trusted worldwide</span>
                    </li>
                    <li className="flex items-start space-x-2 text-sm">
                      <FaGem className="text-blue-600 mt-0.5 text-xs" />
                      <span>Premium materials</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-gray-900">Technical Specifications</h3>
              {initialProduct.specifications && (initialProduct.specifications as Specification[]).length > 0 ? (
                <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
                  {(initialProduct.specifications as Specification[]).map((spec, idx) => (
                    <div key={idx} className={`grid grid-cols-1 sm:grid-cols-3 p-3 text-sm ${idx % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}`}>
                      <span className="font-semibold text-gray-500 text-sm">{spec.name}</span>
                      <span className="sm:col-span-2 font-medium text-gray-900 text-sm">{spec.value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Standard specifications apply.</p>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Customer Reviews</h3>
                  <p className="text-sm text-gray-500">Based on {totalReviews} reviews</p>
                </div>
                <button className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm rounded-lg font-medium hover:shadow-lg transition-all">
                  Write Review
                </button>
              </div>
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="border border-gray-100 rounded-xl p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs">
                          JD
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">John Doe</p>
                          <div className="flex items-center space-x-0.5 text-amber-400">
                            {[...Array(5)].map((_, j) => (
                              <FaStar key={j} className="text-[8px]" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">2 days ago</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">Amazing product! Highly recommend!</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-3 text-sm text-gray-600">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="p-1.5 bg-blue-100 rounded-lg">
                      <FaShippingFast className="text-blue-600 text-base" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm">Shipping</h4>
                  </div>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start space-x-2">
                      <FiCheck className="text-emerald-500 mt-0.5 text-xs" />
                      <span>Free express shipping</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <FiCheck className="text-emerald-500 mt-0.5 text-xs" />
                      <span>2-3 business days</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <FiCheck className="text-emerald-500 mt-0.5 text-xs" />
                      <span>Real-time tracking</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="p-1.5 bg-emerald-100 rounded-lg">
                      <FaUndo className="text-emerald-600 text-base" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm">Returns</h4>
                  </div>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start space-x-2">
                      <FiCheck className="text-emerald-500 mt-0.5 text-xs" />
                      <span>30-day returns</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <FiCheck className="text-emerald-500 mt-0.5 text-xs" />
                      <span>Full refund or exchange</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <FiCheck className="text-emerald-500 mt-0.5 text-xs" />
                      <span>Free return shipping</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="bg-blue-50 rounded-xl p-3 border border-blue-100 flex items-start space-x-2">
                <FaShieldAlt className="text-blue-600 text-base mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">2-Year Warranty</p>
                  <p className="text-sm text-gray-600">Comprehensive warranty for peace of mind.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">You May Also Like</h2>
                <p className="text-sm text-gray-500">Customers who bought this also bought these</p>
              </div>
              <Link href="/products" className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-1">
                <span>View All</span>
                <FaArrowRight className="text-[10px]" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedProducts.slice(0, 4).map((product) => (
                <Link key={product.id} href={`/product/${product.slug}`}>
                  <div className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-blue-200 transition-all duration-200 hover:shadow-md">
                    <div className="relative aspect-square bg-gray-100">
                      <Image
                        src={product.main_image || FALLBACK_IMAGE}
                        alt={product.name}
                        fill
                        className="object-contain p-3"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-sm line-clamp-2 text-gray-800">{product.name}</h3>
                      <div className="mt-1.5 flex items-center justify-between">
                        <span className="font-bold text-blue-600 text-sm">
                          {formatPrice(Number(product.sale_price) || Number(product.base_price) || 0)}
                        </span>
                        {product.sale_price && Number(product.sale_price) < Number(product.base_price) && (
                          <span className="text-xs text-gray-400 line-through">
                            {formatPrice(Number(product.base_price) || 0)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Fullscreen Image Modal */}
        <AnimatePresence>
          {isImageModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
              onClick={() => setIsImageModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative max-w-5xl w-full max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setIsImageModalOpen(false)}
                  className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors text-sm"
                >
                  <FaCompress className="text-xl" />
                </button>
                <div className="relative w-full h-[70vh]">
                  <Image
                    src={activeImage}
                    alt={initialProduct.name}
                    fill
                    className="object-contain"
                  />
                </div>
                {allGalleryImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-3 bg-black/50 rounded-full px-3 py-1.5">
                    <button
                      onClick={() => setCurrentImageIndex(prev => prev === 0 ? allGalleryImages.length - 1 : prev - 1)}
                      className="p-1.5 hover:bg-white/20 rounded-full transition-colors text-white"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <span className="text-white text-xs">
                      {currentImageIndex + 1} / {allGalleryImages.length}
                    </span>
                    <button
                      onClick={() => setCurrentImageIndex(prev => prev === allGalleryImages.length - 1 ? 0 : prev + 1)}
                      className="p-1.5 hover:bg-white/20 rounded-full transition-colors text-white"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}