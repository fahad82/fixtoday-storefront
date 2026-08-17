// src/components/common/CategoryScroll.tsx
"use client";

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { useCategories } from '../../hooks/useCategories';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { HiSquares2X2 } from 'react-icons/hi2';

interface CategoryScrollProps {
  onCategorySelect?: (categoryId: string | null) => void;
}

export const CategoryScroll: React.FC<CategoryScrollProps> = ({ onCategorySelect }) => {
  const { categories, loading, selectedCategory, selectCategory } = useCategories();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const handleCategoryClick = (categoryId: string | null): void => {
    selectCategory(categoryId);
    if (onCategorySelect) {
      onCategorySelect(categoryId);
    }
  };

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [categories]);

  const scroll = (direction: 'left' | 'right'): void => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      const currentScroll = scrollRef.current.scrollLeft;
      const targetScroll = direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount;
      scrollRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
      setTimeout(checkScroll, 300);
    }
  };

  if (loading) {
    return (
      <div className="border-t border-b border-gray-100 bg-white py-3">
        <div className="container mx-auto px-4">
          <div className="flex space-x-5 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col items-center space-y-2 flex-shrink-0 animate-pulse">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-2xl border border-gray-200"></div>
                <div className="h-2.5 w-14 bg-gray-100 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-b border-gray-100 bg-white">
      <div className="container mx-auto px-3 sm:px-6 py-3">
        <div className="relative group/scroll">
          {/* Left Scroll Arrow */}
          {showLeftArrow && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 bg-white/95 backdrop-blur-sm shadow-md rounded-full flex items-center justify-center border border-gray-200 text-gray-700 hover:text-blue-600 hover:scale-110 transition-all duration-200"
              aria-label="Scroll left"
            >
              <FaChevronLeft className="text-xs" />
            </button>
          )}

          {/* Scrollable Categories Track with Custom Spacing */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex items-center gap-4 sm:gap-6 overflow-x-auto scrollbar-none py-1 px-4 sm:px-6"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* All Categories Option */}
            <button
              onClick={() => handleCategoryClick(null)}
              className="flex flex-col items-center flex-shrink-0 group/item focus:outline-none transition-transform duration-200 hover:-translate-y-1 mx-1"
            >
              <div
                className={`w-30 h-30 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                  !selectedCategory
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-200 ring-2 ring-blue-600 ring-offset-2'
                    : 'bg-gray-50 text-gray-600 border border-gray-200/80 group-hover/item:border-blue-400 group-hover/item:bg-white group-hover/item:shadow-md'
                }`}
              >
                <HiSquares2X2 className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <span
                className={`mt-2 text-[11px] sm:text-xs font-medium tracking-tight text-center truncate max-w-[72px] sm:max-w-[84px] leading-tight transition-colors ${
                  !selectedCategory ? 'text-blue-600 font-semibold' : 'text-gray-700 group-hover/item:text-blue-600'
                }`}
              >
                All Categories
              </span>
            </button>

            {/* Square Category Cards */}
            {categories.map((category) => {
              const isActive = selectedCategory === category.id;

              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className="flex flex-col items-center flex-shrink-0 group/item focus:outline-none transition-transform duration-200 hover:-translate-y-1 mx-1"
                >
                  {/* Square Card Frame */}
                  <div
                    className={`relative w-20 h-20 sm:w-20 sm:h-20 rounded-2xl p-2.5 bg-gray-50 flex items-center justify-center transition-all duration-200 overflow-hidden ${
                      isActive
                        ? 'border-2 border-blue-600 bg-blue-50/20 ring-2 ring-blue-600/20 shadow-sm'
                        : 'border border-gray-200/80 group-hover/item:border-blue-400 group-hover/item:bg-white group-hover/item:shadow-md'
                    }`}
                  >
                    {category.image ? (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          sizes="(max-width: 800px) 200px, 200px"
                          className="object-contain p-1 filter drop-shadow-xs transition-transform duration-300 group-hover/item:scale-105"
                        />
                      </div>
                    ) : (
                      <span className="text-gray-500 font-bold text-lg sm:text-xl">
                        {category.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Label */}
                  <span
                    className={`mt-2 text-[11px] sm:text-xs font-medium tracking-tight text-center truncate max-w-[72px] sm:max-w-[84px] leading-tight transition-colors ${
                      isActive ? 'text-blue-600 font-semibold' : 'text-gray-700 group-hover/item:text-blue-600'
                    }`}
                  >
                    {category.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Scroll Arrow */}
          {showRightArrow && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 bg-white/95 backdrop-blur-sm shadow-md rounded-full flex items-center justify-center border border-gray-200 text-gray-700 hover:text-blue-600 hover:scale-110 transition-all duration-200"
              aria-label="Scroll right"
            >
              <FaChevronRight className="text-xs" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryScroll;