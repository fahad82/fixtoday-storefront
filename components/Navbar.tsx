// components/Navbar.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  FaApple, 
  FaAndroid, 
  FaLaptop, 
  FaRegHeart,
  FaShoppingCart,
  FaUserCircle,
  FaPlug,
  FaChevronDown,
  FaHeart
} from 'react-icons/fa';
import { 
  GiHeadphones,
} from 'react-icons/gi';
import { 
  IoGameControllerOutline,
} from 'react-icons/io5';
import { 
  BsFillPhoneFill,
} from 'react-icons/bs';
import { MdOutlineComputer } from 'react-icons/md';
import { brandService } from '@/services/brandService';
import { Brand } from '@/types/product.types';
import { FiMenu, FiX } from 'react-icons/fi';
import { useCart } from '@/contexts/CartContext';
import CartDrawer from './CartDrawer';

interface DropdownItem {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  productCount?: number;
}

interface NavCategory {
  id: string;
  name: string;
  displayName: string;
  icon: React.ReactNode;
  slug: string;
  dropdownItems?: DropdownItem[];
  isDropdown?: boolean;
}

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { getCartCount, getWishlistCount } = useCart();

  // Fetch brands from API
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const allBrands = await brandService.getBrands();
        const activeBrands = allBrands
          .filter(brand => brand.status === 'active')
          .sort((a, b) =>
            (((a as any).sort_order ?? (a as any).sortOrder ?? 0) as number) -
            (((b as any).sort_order ?? (b as any).sortOrder ?? 0) as number)
          );
        setBrands(activeBrands);
      } catch (error) {
        console.error('Error fetching brands:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDropdownEnter = (categoryId: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(categoryId);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const handleBrandClick = (brandSlug: string) => {
    setActiveDropdown(null);
    router.push(`/brand/${brandSlug}`);
  };

  // Separate brands by category
  const androidBrands = brands.filter(b => b.slug !== 'apple');
  const laptopBrands = brands.filter(b => ['dell', 'hp', 'lenovo', 'asus', 'msi', 'acer'].includes(b.slug));
  const accessoriesBrands = brands.filter(b => ['samsung', 'apple', 'sony', 'jbl', 'bose', 'logitech'].includes(b.slug));
  const headphonesBrands = brands.filter(b => ['sony', 'bose', 'samsung', 'apple', 'jbl'].includes(b.slug));
  const gamingBrands = brands.filter(b => ['sony', 'microsoft', 'nintendo', 'razer', 'logitech', 'asus'].includes(b.slug));

  // Navigation categories with dropdowns
  const categories: NavCategory[] = [
    { 
      id: 'apple', 
      name: 'Apple', 
      displayName: 'Apple', 
      icon: <FaApple className="text-xl" />, 
      slug: 'apple',
      isDropdown: false
    },
    { 
      id: 'android', 
      name: 'Android', 
      displayName: 'Android', 
      icon: <FaAndroid className="text-xl" />, 
      slug: 'android',
      isDropdown: true,
      dropdownItems: androidBrands.map(brand => ({
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        logo: brand.logo,
        productCount: 0
      }))
    },
    { 
      id: 'laptops', 
      name: 'Laptops', 
      displayName: 'Laptops', 
      icon: <MdOutlineComputer className="text-xl" />, 
      slug: 'laptops',
      isDropdown: true,
      dropdownItems: laptopBrands.length > 0 ? laptopBrands.map(brand => ({
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        logo: brand.logo
      })) : [
        { id: 'dell', name: 'Dell', slug: 'dell' },
        { id: 'hp', name: 'HP', slug: 'hp' },
        { id: 'lenovo', name: 'Lenovo', slug: 'lenovo' },
        { id: 'asus', name: 'Asus', slug: 'asus' },
        { id: 'acer', name: 'Acer', slug: 'acer' },
      ]
    },
    { 
      id: 'accessories', 
      name: 'Accessories', 
      displayName: 'Accessories', 
      icon: <FaPlug className="text-xl" />, 
      slug: 'accessories',
      isDropdown: true,
      dropdownItems: [
        { id: 'chargers', name: 'Chargers & Cables', slug: 'chargers' },
        { id: 'cases', name: 'Phone Cases', slug: 'cases' },
        { id: 'screen-protectors', name: 'Screen Protectors', slug: 'screen-protectors' },
        { id: 'power-banks', name: 'Power Banks', slug: 'power-banks' },
        { id: 'stands', name: 'Phone Stands', slug: 'stands' },
      ]
    },
    { 
      id: 'headphones', 
      name: 'Headphones', 
      displayName: 'Headphones', 
      icon: <GiHeadphones className="text-xl" />, 
      slug: 'headphones',
      isDropdown: true,
      dropdownItems: headphonesBrands.length > 0 ? headphonesBrands.map(brand => ({
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        logo: brand.logo
      })) : [
        { id: 'sony', name: 'Sony', slug: 'sony' },
        { id: 'bose', name: 'Bose', slug: 'bose' },
        { id: 'samsung', name: 'Samsung', slug: 'samsung' },
        { id: 'apple', name: 'Apple', slug: 'apple' },
        { id: 'jbl', name: 'JBL', slug: 'jbl' },
      ]
    },
    { 
      id: 'handsets', 
      name: 'Handsets', 
      displayName: 'Handsets', 
      icon: <BsFillPhoneFill className="text-xl" />, 
      slug: 'handsets',
      isDropdown: true,
      dropdownItems: [
        { id: 'smartphones', name: 'Smartphones', slug: 'smartphones' },
        { id: 'feature-phones', name: 'Feature Phones', slug: 'feature-phones' },
        { id: 'refurbished', name: 'Refurbished Phones', slug: 'refurbished' },
      ]
    },
    { 
      id: 'gaming', 
      name: 'Gaming', 
      displayName: 'Gaming Console', 
      icon: <IoGameControllerOutline className="text-xl" />, 
      slug: 'gaming',
      isDropdown: true,
      dropdownItems: gamingBrands.length > 0 ? gamingBrands.map(brand => ({
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        logo: brand.logo
      })) : [
        { id: 'sony', name: 'PlayStation', slug: 'playstation' },
        { id: 'microsoft', name: 'Xbox', slug: 'xbox' },
        { id: 'nintendo', name: 'Nintendo', slug: 'nintendo' },
        { id: 'razer', name: 'Razer', slug: 'razer' },
      ]
    },
  ];

  const isActiveBrand = (slug: string): boolean => {
    return pathname === `/brand/${slug}`;
  };

  const cartCount = getCartCount();
  const wishlistCount = getWishlistCount();

  if (loading) {
    return (
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">F</span>
              </div>
              <div>
                <span className="text-xl font-bold text-gray-800">FixToday</span>
              </div>
            </div>
            <div className="animate-pulse flex gap-2">
              <div className="w-20 h-8 bg-gray-200 rounded-full"></div>
              <div className="w-20 h-8 bg-gray-200 rounded-full"></div>
              <div className="w-20 h-8 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      {/* Top Bar - Offers Section */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-2.5 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-8 text-sm font-medium animate-marquee whitespace-nowrap">
            <span>🔥 Limited Time Offer: Up to 40% Off on Select Items!</span>
            <span>✨ Free Shipping on Orders Over $50</span>
            <span>🎁 New Customer? Get 15% Off Your First Order</span>
            <span>💳 EMI Available on All Products</span>
            <span>🚚 Same Day Delivery in Metro Cities</span>
            <span>⭐️ 2 Year Warranty on All Electronics</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg'
            : 'bg-white shadow-md'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            {/* Left Side - Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="relative w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <span className="text-white font-bold text-2xl">F</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent leading-tight">
                    FixToday
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium tracking-wide">Electronics Hub</span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation - Centered Categories with Dropdowns */}
            <div className="hidden lg:flex items-center justify-center flex-1 mx-8">
              <div className="flex items-center gap-1 bg-gray-50 rounded-full px-2 py-1 shadow-inner border border-gray-100">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="relative"
                    onMouseEnter={() => category.isDropdown && handleDropdownEnter(category.id)}
                    onMouseLeave={handleDropdownLeave}
                  >
                    {/* Category Button */}
                    {category.isDropdown ? (
                      <button
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 text-sm font-medium group ${
                          activeDropdown === category.id
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-700 hover:text-blue-600 hover:bg-white'
                        }`}
                      >
                        <span className="group-hover:scale-110 transition-transform duration-200">
                          {category.icon}
                        </span>
                        <span>{category.displayName}</span>
                        <FaChevronDown className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === category.id ? 'rotate-180' : ''}`} />
                      </button>
                    ) : (
                      <Link
                        href={`/brand/${category.slug}`}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 text-sm font-medium group ${
                          isActiveBrand(category.slug)
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-700 hover:text-blue-600 hover:bg-white'
                        }`}
                      >
                        <span className="group-hover:scale-110 transition-transform duration-200">
                          {category.icon}
                        </span>
                        <span>{category.displayName}</span>
                      </Link>
                    )}

                    {/* Dropdown Menu */}
                    {category.isDropdown && activeDropdown === category.id && category.dropdownItems && category.dropdownItems.length > 0 && (
                      <div 
                        className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-slideDown z-50"
                        onMouseEnter={() => handleDropdownEnter(category.id)}
                        onMouseLeave={handleDropdownLeave}
                      >
                        <div className="py-2 max-h-80 overflow-y-auto">
                          {category.dropdownItems.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => handleBrandClick(item.slug)}
                              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 group"
                            >
                              {item.logo ? (
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                                  <img src={item.logo} alt={item.name} className="w-6 h-6 object-contain" />
                                </div>
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                                  {category.id === 'android' && <FaAndroid className="w-4 h-4 text-green-600" />}
                                  {category.id === 'laptops' && <MdOutlineComputer className="w-4 h-4 text-blue-600" />}
                                  {category.id === 'accessories' && <FaPlug className="w-4 h-4 text-purple-600" />}
                                  {category.id === 'headphones' && <GiHeadphones className="w-4 h-4 text-red-600" />}
                                  {category.id === 'gaming' && <IoGameControllerOutline className="w-4 h-4 text-emerald-600" />}
                                  {category.id === 'handsets' && <BsFillPhoneFill className="w-4 h-4 text-indigo-600" />}
                                </div>
                              )}
                              <div>
                                <div className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                                  {item.name}
                                </div>
                                {item.productCount !== undefined && item.productCount > 0 && (
                                  <div className="text-xs text-gray-500">{item.productCount} products</div>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Wishlist, Cart, Profile */}
            <div className="flex items-center gap-2">
              {/* Wishlist Icon */}
              <Link 
                href="/wishlist" 
                className="relative p-2 text-gray-600 hover:text-red-500 transition-all duration-200 rounded-full hover:bg-red-50 group"
              >
                <FaRegHeart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {wishlistCount > 99 ? '99+' : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Icon */}
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-600 hover:text-blue-600 transition-all duration-200 rounded-full hover:bg-blue-50 group"
              >
                <FaShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 animate-pulse">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </button>

              {/* Profile Icon */}
              <button className="p-2 text-gray-600 hover:text-indigo-600 transition-all duration-200 rounded-full hover:bg-indigo-50 group">
                <FaUserCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none transition-colors ml-1"
              >
                {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-100 animate-slideDown">
              <div className="flex flex-col gap-1 max-h-[70vh] overflow-y-auto">
                {categories.map((category) => (
                  <div key={category.id}>
                    <Link
                      href={`/brand/${category.slug}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                    >
                      <span className="text-2xl">{category.icon}</span>
                      <span className="font-medium">{category.displayName}</span>
                    </Link>
                    
                    {/* Show dropdown items in mobile */}
                    {category.dropdownItems && category.dropdownItems.length > 0 && (
                      <div className="pl-12 space-y-1 mb-2">
                        {category.dropdownItems.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => {
                              handleBrandClick(item.slug);
                              setIsMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            {item.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                <div className="h-px bg-gray-100 my-2"></div>
                
                <div className="flex items-center justify-around pt-2">
                  <Link 
                    href="/wishlist" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex flex-col items-center gap-1 text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <FaRegHeart className="w-5 h-5" />
                    <span className="text-xs">Wishlist</span>
                    {wishlistCount > 0 && (
                      <span className="text-xs bg-red-500 text-white rounded-full px-1">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                  <button 
                    onClick={() => {
                      setIsCartOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="flex flex-col items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <FaShoppingCart className="w-5 h-5" />
                    <span className="text-xs">Cart</span>
                    {cartCount > 0 && (
                      <span className="text-xs bg-blue-600 text-white rounded-full px-1">
                        {cartCount}
                      </span>
                    )}
                  </button>
                  <button className="flex flex-col items-center gap-1 text-gray-600 hover:text-indigo-600 transition-colors">
                    <FaUserCircle className="w-5 h-5" />
                    <span className="text-xs">Profile</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
        
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </>
  );
};

export default Navbar;