// app/product/[slug]/page.tsx
'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { productService } from '@/services/productService';
import { brandService } from '@/services/brandService';
import { Product, ProductVariant, Brand } from '@/types/product.types';
import ProductCard from '@/components/ProductCard';
import { 
  FaShoppingCart, 
  FaStar, 
  FaStarHalfAlt, 
  FaRegStar,
  FaTruck, 
  FaShieldAlt, 
  FaUndo, 
  FaChevronLeft,
  FaCheckCircle,
  FaSpinner,
  FaHeart,
  FaShare,
  FaEye,
  FaFacebook,
  FaTwitter,
  FaWhatsapp,
  FaCopy
} from 'react-icons/fa';
import { useCart } from '@/contexts/CartContext';

// Loading Component
const ProductLoading: React.FC = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-64 mb-8"></div>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-6 lg:p-8">
            <div className="bg-gray-100 rounded-xl h-96"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Error Component
const ProductError: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto text-center">
      <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-5xl">😞</span>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
      <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
      <div className="flex gap-4 justify-center">
        <button
          onClick={onRetry}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-6 py-2.5 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-all"
        >
          Go Home
        </Link>
      </div>
    </div>
  </div>
);

// Quantity Selector Component
interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  maxStock?: number;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ 
  quantity, 
  onIncrease, 
  onDecrease, 
  maxStock = Infinity 
}) => (
  <div className="flex items-center bg-gray-100 rounded-xl p-1">
    <button
      onClick={onDecrease}
      disabled={quantity <= 1}
      className="w-10 h-10 flex items-center justify-center bg-white rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
    >
      <span className="text-lg font-medium">-</span>
    </button>
    <span className="w-14 text-center font-semibold text-gray-800">{quantity}</span>
    <button
      onClick={onIncrease}
      disabled={quantity >= maxStock}
      className="w-10 h-10 flex items-center justify-center bg-white rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
    >
      <span className="text-lg font-medium">+</span>
    </button>
  </div>
);

// Share Modal Component
const ShareModal: React.FC<{ onClose: () => void; productName: string; productUrl: string }> = ({ 
  onClose, 
  productName, 
  productUrl 
}) => {
  const [copied, setCopied] = useState(false);

  const shareLinks = [
    { name: 'Facebook', icon: <FaFacebook className="w-5 h-5" />, url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`, color: 'bg-[#1877f2]' },
    { name: 'Twitter', icon: <FaTwitter className="w-5 h-5" />, url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(productName)}&url=${encodeURIComponent(productUrl)}`, color: 'bg-[#1da1f2]' },
    { name: 'WhatsApp', icon: <FaWhatsapp className="w-5 h-5" />, url: `https://wa.me/?text=${encodeURIComponent(productName + ' ' + productUrl)}`, color: 'bg-[#25d366]' },
  ];

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(productUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 w-96 z-50 shadow-2xl animate-fadeIn">
        <h3 className="text-xl font-bold mb-4">Share this product</h3>
        <div className="space-y-3">
          {shareLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-3 px-4 py-3 ${link.color} text-white rounded-xl hover:opacity-90 transition-all`}
            >
              {link.icon}
              <span>Share on {link.name}</span>
            </a>
          ))}
          <button
            onClick={copyToClipboard}
            className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all"
          >
            <FaCopy className="w-5 h-5" />
            <span>{copied ? 'Copied!' : 'Copy link'}</span>
          </button>
        </div>
      </div>
    </>
  );
};

// Main Product Page Component
const ProductPageContent: React.FC = () => {
  const params = useParams();
  const slug = params.slug as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'reviews'>('details');
  
  const { addToCart, isInWishlist, addToWishlist, removeFromWishlist } = useCart();
  const isWishlisted = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getProductBySlug(slug);
      if (data) {
        setProduct(data);
        setSelectedImage(data.main_image);
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
        
        // Fetch brand info
        if (data.brand_id) {
          const brandData = await brandService.getBrandById(data.brand_id);
          if (brandData) setBrand(brandData);
        }
        
        // Fetch suggested products (same brand or similar category)
        await fetchSuggestedProducts(data);
      } else {
        setError('Product not found');
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestedProducts = async (currentProduct: Product) => {
    try {
      // Fetch products from same brand or category
      const suggestions = await productService.getProducts({
        brand_id: currentProduct.brand_id || undefined,
        limit: 4,
        status: 'active'
      });
      
      // Filter out current product
      const filtered = suggestions.products.filter(p => p.id !== currentProduct.id);
      setSuggestedProducts(filtered.slice(0, 4));
    } catch (err) {
      console.error('Error fetching suggested products:', err);
    }
  };

  const handleAddToCart = () => {
    if (selectedVariant) {
      addToCart(product!, quantity, selectedVariant);
    } else {
      addToCart(product!, quantity);
    }
    setAddingToCart(true);
    setTimeout(() => setAddingToCart(false), 1500);
  };

  const handleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product!.id);
    } else {
      addToWishlist(product!);
    }
  };

  const getCurrentPrice = (): number => {
    if (selectedVariant?.sale_price) return selectedVariant.sale_price;
    if (selectedVariant?.price) return selectedVariant.price;
    if (product?.sale_price) return product.sale_price;
    return product?.base_price || 0;
  };

  const getOriginalPrice = (): number | null => {
    if (selectedVariant?.price && selectedVariant.sale_price) return selectedVariant.price;
    if (product?.base_price && product.sale_price) return product.base_price;
    return null;
  };

  const getCurrentStock = (): number => {
    if (selectedVariant) return selectedVariant.stock_quantity;
    return product?.stock_quantity || 0;
  };

  const isOutOfStock = getCurrentStock() === 0;
  const discount = getOriginalPrice() 
    ? Math.round(((getOriginalPrice()! - getCurrentPrice()) / getOriginalPrice()!) * 100)
    : 0;

  if (loading) return <ProductLoading />;
  if (error || !product) return <ProductError onRetry={fetchProduct} />;

  const galleryImages = [product.main_image, ...(product.gallery_images || [])].filter(Boolean);
  const productUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 sticky top-[73px] z-30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-blue-600 transition-colors">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href="/brands" className="text-gray-500 hover:text-blue-600 transition-colors">Brands</Link>
            {brand && (
              <>
                <span className="text-gray-400">/</span>
                <Link href={`/brand/${brand.slug}`} className="text-gray-500 hover:text-blue-600 transition-colors">
                  {brand.name}
                </Link>
              </>
            )}
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium truncate">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Product Main Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="grid lg:grid-cols-2 gap-8 p-6 lg:p-10">
            {/* Product Images */}
            <div>
              {/* Main Image */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 mb-4 relative group">
                <div className="relative h-96 w-full">
                  {selectedImage ? (
                    <Image
                      src={selectedImage}
                      alt={product.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Thumbnail Gallery */}
              {galleryImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 justify-center">
                  {galleryImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(image)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                        selectedImage === image 
                          ? 'border-blue-600 shadow-lg ring-2 ring-blue-200' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {image && (
                        <Image
                          src={image}
                          alt={`${product.name} - view ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              {/* Brand Badge */}
              {brand && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-4">
                  {brand.logo && (
                    <div className="relative w-4 h-4">
                      <Image src={brand.logo} alt={brand.name} fill className="object-contain" />
                    </div>
                  )}
                  {brand.name}
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                {product.name}
              </h1>
              
              {product.short_description && (
                <p className="text-gray-600 mb-4 leading-relaxed">{product.short_description}</p>
              )}

              {/* Rating */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => {
                      const rating = 4.5;
                      if (i < Math.floor(rating)) {
                        return <FaStar key={i} className="w-4 h-4 fill-current" />;
                      } else if (i < rating) {
                        return <FaStarHalfAlt key={i} className="w-4 h-4 fill-current" />;
                      } else {
                        return <FaRegStar key={i} className="w-4 h-4" />;
                      }
                    })}
                  </div>
                  <span className="text-sm font-medium text-gray-700 ml-1">4.5</span>
                </div>
                <span className="text-sm text-gray-500">(128 verified reviews)</span>
                <div className="flex items-center gap-1 text-green-600">
                  <FaCheckCircle className="w-4 h-4" />
                  <span className="text-sm">98% positive</span>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-blue-600">
                    £{getCurrentPrice().toFixed(2)}
                  </span>
                  {getOriginalPrice() && (
                    <>
                      <span className="text-xl text-gray-400 line-through">
                        £{getOriginalPrice()!.toFixed(2)}
                      </span>
                      <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-1 rounded-lg text-sm font-semibold">
                        Save {discount}%
                      </span>
                    </>
                  )}
                </div>
                {product.cost_price && (
                  <p className="text-sm text-gray-500 mt-1">
                    Inclusive of all taxes
                  </p>
                )}
              </div>

              {/* Variants Selection */}
              {product.has_variants && product.variants && product.variants.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Select Variant</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`p-3 border-2 rounded-xl text-left transition-all ${
                          selectedVariant?.id === variant.id
                            ? 'border-blue-600 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                        }`}
                      >
                        <div className="font-medium text-sm text-gray-800">
                          {Object.values(variant.attributes).join(' / ')}
                        </div>
                        <div className="text-blue-600 font-bold mt-1">
                          £{(variant.sale_price || variant.price)?.toFixed(2)}
                        </div>
                        {variant.stock_quantity === 0 && (
                          <div className="text-xs text-red-500 mt-1">Out of Stock</div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock Status */}
              <div className="mb-6">
                {isOutOfStock ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    Out of Stock
                  </div>
                ) : getCurrentStock() < 10 ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                    <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                    Only {getCurrentStock()} left - Order soon!
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    <FaCheckCircle className="w-4 h-4" />
                    In Stock - Ready to ship
                  </div>
                )}
              </div>

              {/* Quantity and Actions */}
              <div className="flex flex-wrap gap-4 mb-8">
                {!isOutOfStock && (
                  <QuantitySelector
                    quantity={quantity}
                    onIncrease={() => setQuantity(prev => Math.min(prev + 1, getCurrentStock()))}
                    onDecrease={() => setQuantity(prev => Math.max(1, prev - 1))}
                    maxStock={getCurrentStock()}
                  />
                )}
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || addingToCart}
                  className={`flex-1 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                    isOutOfStock
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:scale-[1.02] active:scale-95'
                  }`}
                >
                  {addingToCart ? (
                    <>
                      <FaSpinner className="w-5 h-5 animate-spin" />
                      Added to Cart!
                    </>
                  ) : (
                    <>
                      <FaShoppingCart className="w-5 h-5" />
                      {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                    </>
                  )}
                </button>
                <button
                  onClick={handleWishlist}
                  className={`px-5 py-3.5 rounded-xl font-medium transition-all flex items-center gap-2 ${
                    isWishlisted
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <FaHeart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                </button>
                <button
                  onClick={() => setShowShareModal(true)}
                  className="px-5 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all flex items-center gap-2"
                >
                  <FaShare className="w-5 h-5" />
                  Share
                </button>
              </div>

              {/* Delivery Info */}
              <div className="border-t pt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <FaTruck className="w-5 h-5 text-green-600" />
                  <div>
                    <span className="font-medium text-gray-800">Free Delivery</span>
                    <p className="text-xs text-gray-500">On orders over £50</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <FaShieldAlt className="w-5 h-5 text-blue-600" />
                  <div>
                    <span className="font-medium text-gray-800">2 Year Warranty</span>
                    <p className="text-xs text-gray-500">Manufacturer warranty included</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <FaUndo className="w-5 h-5 text-purple-600" />
                  <div>
                    <span className="font-medium text-gray-800">Easy Returns</span>
                    <p className="text-xs text-gray-500">30-day return policy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="border-t border-gray-100">
            <div className="flex border-b border-gray-100 px-6 lg:px-10">
              {[
                { id: 'details', label: 'Product Details', icon: <FaEye className="w-4 h-4" /> },
                { id: 'specs', label: 'Specifications', icon: <FaCheckCircle className="w-4 h-4" /> },
                { id: 'reviews', label: 'Reviews (128)', icon: <FaStar className="w-4 h-4" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-all ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6 lg:p-10">
              {activeTab === 'details' && (
                <div className="prose max-w-none">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Product Description</h3>
                  {product.description ? (
                    <div 
                      className="text-gray-600 leading-relaxed space-y-4"
                      dangerouslySetInnerHTML={{ __html: product.description }} 
                    />
                  ) : (
                    <p className="text-gray-500">No detailed description available for this product.</p>
                  )}
                </div>
              )}

              {activeTab === 'specs' && product.specifications && product.specifications.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Technical Specifications</h3>
                  <div className="bg-gray-50 rounded-2xl overflow-hidden">
                    <table className="w-full">
                      <tbody>
                        {product.specifications.map((spec, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 font-semibold text-gray-700 w-1/3 border-b border-gray-100">
                              {spec.name}
                            </td>
                            <td className="px-6 py-4 text-gray-600 border-b border-gray-100">
                              {spec.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">⭐</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Customer Reviews</h3>
                  <p className="text-gray-500">Reviews coming soon!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Suggested Products Section */}
        {suggestedProducts.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">You May Also Like</h2>
                <p className="text-gray-500 text-sm mt-1">Customers who bought this also viewed</p>
              </div>
              <Link 
                href={`/brand/${product.brand_id}`} 
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                View All <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {suggestedProducts.map((suggested) => (
                <ProductCard key={suggested.id} product={suggested} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal 
          onClose={() => setShowShareModal(false)} 
          productName={product.name}
          productUrl={productUrl}
        />
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, -48%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

// Main Component with Suspense
const ProductPage: React.FC = () => {
  return (
    <Suspense fallback={<ProductLoading />}>
      <ProductPageContent />
    </Suspense>
  );
};

export default ProductPage;