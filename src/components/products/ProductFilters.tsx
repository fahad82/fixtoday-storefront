// src/components/products/ProductFilters.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaChevronDown, FaChevronUp, FaTimes, FaFilter, 
  FaSlidersH, FaCheck, FaStar, FaStarHalfAlt
} from 'react-icons/fa';
import { FilterOptions, Category, Brand } from '../../types';

interface ProductFiltersProps {
  filterOptions: FilterOptions;
  selectedCategory: string | null;
  onApplyFilters: (filters: Record<string, any>) => void;
  onResetFilters: () => void;
  currentFilters: Record<string, any>;
  categories: Category[];
  isMobile?: boolean;
  onClose?: () => void;
}

interface LocalFilters {
  storage?: string;
  ram?: string;
  colors?: string;
  rating?: number;
  [key: string]: any;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filterOptions,
  selectedCategory,
  onApplyFilters,
  onResetFilters,
  currentFilters,
  categories,
  isMobile = false,
  onClose,
}) => {
  const [localFilters, setLocalFilters] = useState<LocalFilters>({});
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    category: true,
    brand: true,
    price: true,
    storage: false,
    ram: false,
    color: false,
    rating: false,
  });
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filterOptions.minPrice || 0,
    filterOptions.maxPrice || 1000,
  ]);
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  useEffect(() => {
    setLocalFilters(currentFilters);
    if (currentFilters.brand_id) {
      setSelectedBrands([currentFilters.brand_id]);
    }
    if (currentFilters.min_price !== undefined && currentFilters.max_price !== undefined) {
      setPriceRange([currentFilters.min_price, currentFilters.max_price]);
    }

    // Count active filters
    let count = 0;
    if (currentFilters.brand_id) count++;
    if (currentFilters.min_price || currentFilters.max_price) count++;
    if (currentFilters.storage) count++;
    if (currentFilters.ram) count++;
    if (currentFilters.colors) count++;
    if (currentFilters.rating) count++;
    setActiveFilterCount(count);
  }, [currentFilters]);

  const toggleSection = (section: string): void => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleBrandToggle = (brandId: string): void => {
    setSelectedBrands((prev) => {
      const newBrands = prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId];
      return newBrands;
    });
  };

  const handleApplyFilters = (): void => {
    const filters: Record<string, any> = {
      brand_id: selectedBrands.length > 0 ? selectedBrands[0] : undefined,
      min_price: priceRange[0],
      max_price: priceRange[1],
      ...localFilters,
    };
    onApplyFilters(filters);
    if (isMobile && onClose) {
      onClose();
    }
  };

  const handleReset = (): void => {
    setSelectedBrands([]);
    setPriceRange([filterOptions.minPrice || 0, filterOptions.maxPrice || 1000]);
    setLocalFilters({});
    onResetFilters();
    if (isMobile && onClose) {
      onClose();
    }
  };

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
  }).format(price);
};

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < Math.floor(rating)) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i < Math.ceil(rating) && rating % 1 >= 0.5) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaStar key={i} className="text-gray-200" />);
      }
    }
    return stars;
  };

  const currentCategoryName = selectedCategory
    ? categories.find((c) => c.id === selectedCategory)?.name || 'All'
    : 'All';

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${
      isMobile ? 'w-full' : 'sticky top-24'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <FaSlidersH className="text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs font-bold rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {activeFilterCount > 0 && (
            <button
              onClick={handleReset}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
            >
              <FaTimes className="text-[10px]" />
              <span>Clear All</span>
            </button>
          )}
          {isMobile && onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FaTimes className="text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Sections */}
      <div className="space-y-1">
        {/* Category */}
        <FilterSection
          title="Category"
          expanded={expandedSections.category}
          onToggle={() => toggleSection('category')}
          count={1}
        >
          <div className="text-sm text-gray-600 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg px-4 py-2.5 border border-blue-100">
            <span className="font-medium text-gray-700">Selected:</span>{' '}
            <span className="text-blue-600 font-medium">{currentCategoryName}</span>
          </div>
          {selectedCategory && (
            <button
              onClick={() => {
                // Clear category selection
                onApplyFilters({ ...currentFilters, category_id: undefined });
              }}
              className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Change category
            </button>
          )}
        </FilterSection>

        {/* Brands */}
        {filterOptions.brands && filterOptions.brands.length > 0 && (
          <FilterSection
            title="Brands"
            expanded={expandedSections.brand}
            onToggle={() => toggleSection('brand')}
            count={selectedBrands.length}
          >
            <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
              {filterOptions.brands.map((brand: Brand) => (
                <label
                  key={brand.id}
                  className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors group"
                >
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand.id)}
                    onChange={() => handleBrandToggle(brand.id)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 focus:ring-2"
                  />
                  {brand.logo && (
                    <img src={brand.logo} alt={brand.name} className="w-6 h-6 object-contain rounded" />
                  )}
                  <span className="text-sm text-gray-700 flex-1 group-hover:text-gray-900 transition-colors">
                    {brand.name}
                  </span>
                  {selectedBrands.includes(brand.id) && (
                    <FaCheck className="text-blue-600 text-xs" />
                  )}
                </label>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Price Range */}
        <FilterSection
          title="Price Range"
          expanded={expandedSections.price}
          onToggle={() => toggleSection('price')}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">{formatPrice(priceRange[0])}</span>
              <span className="text-gray-300">—</span>
              <span className="font-medium text-gray-700">{formatPrice(priceRange[1])}</span>
            </div>
            <div className="relative">
              <input
                type="range"
                min={filterOptions.minPrice || 0}
                max={filterOptions.maxPrice || 1000}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(priceRange[1] / (filterOptions.maxPrice || 1000)) * 100}%, #e5e7eb ${(priceRange[1] / (filterOptions.maxPrice || 1000)) * 100}%, #e5e7eb 100%)`,
                }}
              />
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                className="w-24 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min={filterOptions.minPrice || 0}
              />
              <span className="text-gray-400 text-sm">to</span>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 0])}
                className="w-24 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                max={filterOptions.maxPrice || 1000}
              />
            </div>
          </div>
        </FilterSection>

        {/* Storage */}
        {filterOptions.storageOptions && filterOptions.storageOptions.length > 0 && (
          <FilterSection
            title="Storage"
            expanded={expandedSections.storage}
            onToggle={() => toggleSection('storage')}
          >
            <div className="flex flex-wrap gap-2">
              {filterOptions.storageOptions.map((option: string) => (
                <FilterChip
                  key={option}
                  label={option}
                  selected={localFilters.storage === option}
                  onClick={() => {
                    setLocalFilters((prev) => ({
                      ...prev,
                      storage: prev.storage === option ? undefined : option
                    }));
                  }}
                />
              ))}
            </div>
          </FilterSection>
        )}

        {/* RAM */}
        {filterOptions.ramOptions && filterOptions.ramOptions.length > 0 && (
          <FilterSection
            title="RAM"
            expanded={expandedSections.ram}
            onToggle={() => toggleSection('ram')}
          >
            <div className="flex flex-wrap gap-2">
              {filterOptions.ramOptions.map((option: string) => (
                <FilterChip
                  key={option}
                  label={option}
                  selected={localFilters.ram === option}
                  onClick={() => {
                    setLocalFilters((prev) => ({
                      ...prev,
                      ram: prev.ram === option ? undefined : option
                    }));
                  }}
                />
              ))}
            </div>
          </FilterSection>
        )}

        {/* Colors */}
        {filterOptions.colors && filterOptions.colors.length > 0 && (
          <FilterSection
            title="Colors"
            expanded={expandedSections.color}
            onToggle={() => toggleSection('color')}
          >
            <div className="flex flex-wrap gap-2">
              {filterOptions.colors.map((color: string) => (
                <FilterChip
                  key={color}
                  label={color}
                  selected={localFilters.colors === color}
                  onClick={() => {
                    setLocalFilters((prev) => ({
                      ...prev,
                      colors: prev.colors === color ? undefined : color
                    }));
                  }}
                />
              ))}
            </div>
          </FilterSection>
        )}

        {/* Rating */}
        {filterOptions.ratings && filterOptions.ratings.length > 0 && (
          <FilterSection
            title="Rating"
            expanded={expandedSections.rating}
            onToggle={() => toggleSection('rating')}
          >
            <div className="flex flex-wrap gap-2">
              {filterOptions.ratings.map((rating: number) => (
                <button
                  key={rating}
                  onClick={() => {
                    setLocalFilters((prev) => ({
                      ...prev,
                      rating: prev.rating === rating ? undefined : rating
                    }));
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full border-2 transition-all flex items-center space-x-1 ${
                    localFilters.rating === rating
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <span className="flex items-center space-x-0.5">
                    {renderStars(rating)}
                  </span>
                  <span>& Up</span>
                </button>
              ))}
            </div>
          </FilterSection>
        )}
      </div>

      {/* Apply Button */}
      <button
        onClick={handleApplyFilters}
        className="w-full mt-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-[0.98]"
      >
        Apply Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
      </button>
    </div>
  );
};

// Helper Components
interface FilterSectionProps {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  count?: number;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  expanded,
  onToggle,
  children,
  count = 0,
}) => (
  <div className="border-t border-gray-100 py-3 first:border-t-0 first:pt-0">
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full py-1 text-left group"
    >
      <div className="flex items-center space-x-2">
        <span className="font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
          {title}
        </span>
        {count > 0 && (
          <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 text-[10px] font-bold rounded-full">
            {count}
          </span>
        )}
      </div>
      <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
        {expanded ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
      </div>
    </button>
    <AnimatePresence>
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="pt-3">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

interface FilterChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

const FilterChip: React.FC<FilterChipProps> = ({ label, selected, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3.5 py-1.5 text-xs font-medium rounded-full border-2 transition-all ${
      selected
        ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-sm shadow-blue-100'
        : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-800 hover:bg-gray-50'
    }`}
  >
    {label}
  </button>
);

export default ProductFilters;