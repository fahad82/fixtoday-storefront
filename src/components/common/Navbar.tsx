// src/components/common/Navbar.tsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { FaSearch, FaShoppingCart, FaHeart, FaBars, FaUser, FaStore } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import CategoryScroll from './CategoryScroll';

interface NavbarProps {
  onCategorySelect?: (categoryId: string | null) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onCategorySelect }) => {
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  
  // Safe hooks with error handling
  let totalItems = 0;
  let wishlistCount = 0;
  let openCart = () => {};
  
  try {
    const cart = useCart();
    totalItems = cart.getTotalItems();
    openCart = cart.openCart;
  } catch (error) {
    // CartProvider not available, use defaults
    console.warn('Navbar: CartProvider not found');
  }
  
  try {
    const wishlist = useWishlist();
    wishlistCount = wishlist.wishlist.length;
  } catch (error) {
    // WishlistProvider not available, use defaults
    console.warn('Navbar: WishlistProvider not found');
  }

  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearch = (e: React.FormEvent): void => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200 group-hover:shadow-blue-300 transition-shadow">
                <FaStore className="text-white text-lg" />
              </div>
              <span className="text-2xl font-bold tracking-tight hidden sm:inline">
                <span className="text-blue-600">Fix</span>
                <span className="text-gray-900">Today</span>
              </span>
            </Link>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-4 lg:mx-8">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Search for products, brands, and more..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-5 py-2.5 pl-12 bg-gray-100 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all group-hover:bg-white text-gray-700"
                  />
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
              </form>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-1 md:space-x-2 flex-shrink-0">
              {/* Mobile Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="md:hidden p-2.5 hover:bg-gray-100 rounded-full transition-colors relative"
                aria-label="Search"
              >
                <FaSearch className="text-gray-600" />
              </button>

              {/* User Account - Desktop */}
              <Link
                href="/account"
                className="hidden lg:flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 rounded-full transition-colors group"
              >
                <FaUser className="text-gray-600 group-hover:text-blue-600 transition-colors" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">Account</span>
              </Link>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-2.5 hover:bg-gray-100 rounded-full transition-colors group"
                aria-label="Wishlist"
              >
                <FaHeart className="text-gray-600 group-hover:text-red-500 transition-colors" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-lg">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative p-2.5 hover:bg-gray-100 rounded-full transition-colors group"
                aria-label="Cart"
              >
                <FaShoppingCart className="text-gray-600 group-hover:text-blue-600 transition-colors" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-lg">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2.5 hover:bg-gray-100 rounded-full transition-colors ml-1"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? (
                  <IoClose className="text-gray-600 text-2xl" />
                ) : (
                  <FaBars className="text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          {isSearchOpen && (
            <div className="md:hidden pb-4 animate-slideDown">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-5 py-3 pl-12 bg-gray-100 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-700"
                  />
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Category Scroll Bar */}
        <CategoryScroll onCategorySelect={onCategorySelect} />
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 animate-fadeIn md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Mobile Menu */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden overflow-y-auto ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold" onClick={() => setIsMobileMenuOpen(false)}>
              <span className="text-blue-600">Fix</span>
              <span className="text-gray-900">Today</span>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <IoClose className="text-2xl" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          {/* Mobile Search */}
          <div className="mb-4">
            <form onSubmit={(e) => {
              handleSearch(e);
              setIsMobileMenuOpen(false);
            }}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 pl-10 bg-gray-100 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </form>
          </div>

          <Link 
            href="/account" 
            className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-xl transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FaUser className="text-gray-600" />
            <span className="font-medium">My Account</span>
          </Link>
          
          <Link 
            href="/wishlist" 
            className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-xl transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FaHeart className="text-gray-600" />
            <span className="font-medium">Wishlist ({wishlistCount})</span>
          </Link>
          
          <button 
            onClick={() => {
              openCart();
              setIsMobileMenuOpen(false);
            }} 
            className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-xl transition-colors w-full text-left"
          >
            <FaShoppingCart className="text-gray-600" />
            <span className="font-medium">Cart ({totalItems})</span>
          </button>

          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">© 2024 FixToday. All rights reserved.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;