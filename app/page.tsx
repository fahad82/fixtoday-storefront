// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product, Brand } from '@/types/product.types';
import { productService } from '@/services/productService';
import { brandService } from '@/services/brandService';
import ProductCard from '@/components/ProductCard';
import { 
  FaTruck, 
  FaShieldAlt, 
  FaUndo, 
  FaHeadset, 
  FaStar, 
  FaArrowRight,
  FaMobileAlt,
  FaLaptop,
  FaHeadphones,
  FaGamepad
} from 'react-icons/fa';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [topSelling, setTopSelling] = useState<Product[]>([]);
  const [featuredBrands, setFeaturedBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [
          featuredProductsRes,
          newArrivalsRes,
          topSellingRes,
          brandsRes,
        ] = await Promise.all([
          productService.getProducts({ 
            featured: true, 
            limit: 8,
            status: 'active'
          }),
          productService.getProducts({ 
            limit: 8,
            sortBy: 'created_at',
            sortOrder: 'DESC',
            status: 'active'
          }),
          productService.getProducts({ 
            limit: 8,
            sortBy: 'sale_count',
            sortOrder: 'DESC',
            status: 'active'
          }),
          brandService.getBrands(),
        ]);

        setFeaturedProducts(featuredProductsRes.products);
        setNewArrivals(newArrivalsRes.products);
        setTopSelling(topSellingRes.products);
        setFeaturedBrands(brandsRes.slice(0, 8));
        
      } catch (error) {
        console.error('Error fetching home data:', error);
        setError('Failed to load products. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-600 border-t-transparent"></div>
        <p className="mt-6 text-gray-600 font-medium">Loading amazing deals for you...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="text-7xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section - Full Width */}
      <section className="relative bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <span className="text-yellow-400 text-sm">⚡</span>
                <span className="text-sm font-medium">Summer Sale is Live</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in">
                Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">FixToday</span>
              </h1>
              <p className="text-lg md:text-xl mb-8 text-blue-100 leading-relaxed">
                Discover the latest in technology - from premium smartphones to powerful gaming consoles. 
                Get the best deals on top brands.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/products" 
                  className="bg-white text-blue-900 px-8 py-3 rounded-xl font-semibold hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2 group"
                >
                  Shop Now
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="/deals" 
                  className="border-2 border-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-900 transition-all hover:scale-105"
                >
                  View Deals
                </Link>
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="relative h-80 w-full">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full blur-3xl opacity-30"></div>
                <div className="relative z-10 flex justify-center gap-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 transform rotate-6 hover:rotate-0 transition-transform">
                    <FaMobileAlt className="w-16 h-16 text-white" />
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 transform -rotate-6 hover:rotate-0 transition-transform">
                    <FaLaptop className="w-16 h-16 text-white" />
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 transform rotate-12 hover:rotate-0 transition-transform">
                    <FaHeadphones className="w-16 h-16 text-white" />
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 transform -rotate-12 hover:rotate-0 transition-transform">
                    <FaGamepad className="w-16 h-16 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brands Section - Full Width */}
      <section className="py-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Shop by Brand</h2>
            <p className="text-gray-600 text-lg">Explore products from top brands</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {featuredBrands.map((brand) => (
              <Link 
                key={brand.id} 
                href={`/brand/${brand.slug}`} 
                className="group"
              >
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 text-center hover:shadow-2xl transition-all hover:-translate-y-2 border border-gray-100">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center group-hover:from-blue-100 group-hover:to-indigo-100 transition-all">
                    {brand.logo ? (
                      <div className="relative w-12 h-12">
                        <Image
                          src={brand.logo}
                          alt={brand.name}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 48px, 48px"
                        />
                      </div>
                    ) : (
                      <span className="text-4xl">🏢</span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                    {brand.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Products</h2>
              <p className="text-gray-600 mt-2">Hand-picked just for you</p>
            </div>
            <Link 
              href="/products?featured=true" 
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2 group"
            >
              View All
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl">
              <p className="text-gray-500">No featured products available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">New Arrivals</h2>
              <p className="text-gray-600 mt-2">Latest products added to our store</p>
            </div>
            <Link 
              href="/products?sort=created_at" 
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2 group"
            >
              View All
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          {newArrivals.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <p className="text-gray-500">New arrivals coming soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Top Selling */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Top Selling</h2>
              <p className="text-gray-600 mt-2">Most popular products this month</p>
            </div>
            <Link 
              href="/products?sort=sale_count" 
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2 group"
            >
              View All
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          {topSelling.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {topSelling.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl">
              <p className="text-gray-500">No top selling products available.</p>
            </div>
          )}
        </div>
      </section>

      {/* Special Offers Banner - Full Width */}
      <section className="py-16 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                <span className="text-yellow-300 text-lg">⚡</span>
                <span className="text-sm font-semibold">Limited Time Offer</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-2">Up to 40% Off</h3>
              <p className="text-white/90 text-lg">on select items + free shipping on orders over £50</p>
            </div>
            <Link 
              href="/deals" 
              className="bg-white text-orange-600 px-10 py-4 rounded-xl font-bold hover:shadow-2xl transition-all hover:scale-105 whitespace-nowrap"
            >
              Shop Deals Now →
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-blue-200 transition-all group-hover:scale-110">
                <FaTruck className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Free Shipping</h3>
              <p className="text-gray-600">On orders over £50</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-green-200 transition-all group-hover:scale-110">
                <FaShieldAlt className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Secure Payment</h3>
              <p className="text-gray-600">100% secure transactions</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-purple-200 transition-all group-hover:scale-110">
                <FaUndo className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Easy Returns</h3>
              <p className="text-gray-600">30-day return policy</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-orange-200 transition-all group-hover:scale-110">
                <FaHeadset className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">24/7 Support</h3>
              <p className="text-gray-600">Dedicated customer service</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">Subscribe to Our Newsletter</h3>
            <p className="text-gray-300 mb-8">Get the latest updates on new products and upcoming sales</p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 text-gray-900"
                required
              />
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all hover:scale-105"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-gray-400 mt-6">We respect your privacy. Unsubscribe at any time.</p>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.1);
          }
        }
        .delay-1000 {
          animation-delay: 1s;
        }
        .delay-500 {
          animation-delay: 0.5s;
        }
      `}</style>
    </div>
  );
}