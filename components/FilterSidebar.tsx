'use client';

import { useState } from 'react';
import { FilterOptions } from '@/types';
import Link from 'next/link';

interface FilterSidebarProps {
  filters: FilterOptions;
  activeFilters: {
    minPrice: number;
    maxPrice: number;
    storage: string[];
    colors: string[];
    sortBy: string;
    sortOrder: string;
  };
  onFilterChange: (filters: any) => void;
}

export default function FilterSidebar({ filters, activeFilters, onFilterChange }: FilterSidebarProps) {
  const [priceRange, setPriceRange] = useState([activeFilters.minPrice, activeFilters.maxPrice]);

  const handlePriceChange = (values: [number, number]) => {
    setPriceRange(values);
    onFilterChange({ ...activeFilters, minPrice: values[0], maxPrice: values[1] });
  };

  const handleStorageToggle = (storage: string) => {
    const newStorage = activeFilters.storage.includes(storage)
      ? activeFilters.storage.filter(s => s !== storage)
      : [...activeFilters.storage, storage];
    onFilterChange({ ...activeFilters, storage: newStorage });
  };

  const handleColorToggle = (color: string) => {
    const newColors = activeFilters.colors.includes(color)
      ? activeFilters.colors.filter(c => c !== color)
      : [...activeFilters.colors, color];
    onFilterChange({ ...activeFilters, colors: newColors });
  };

  const clearFilters = () => {
    onFilterChange({
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      storage: [],
      colors: [],
      sortBy: 'created_at',
      sortOrder: 'DESC',
    });
    setPriceRange([filters.minPrice, filters.maxPrice]);
  };

  return (
    <div className="w-64 flex-shrink-0">
      <div className="bg-white rounded-lg p-4 sticky top-20">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold">Filters</h3>
          <button onClick={clearFilters} className="text-xs text-blue-600 hover:underline">
            Clear All
          </button>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <h4 className="font-medium text-sm mb-3">Price Range</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>₨{priceRange[0].toLocaleString()}</span>
              <span>₨{priceRange[1].toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={filters.minPrice}
              max={filters.maxPrice}
              value={priceRange[0]}
              onChange={(e) => handlePriceChange([parseInt(e.target.value), priceRange[1]])}
              className="w-full"
            />
            <input
              type="range"
              min={filters.minPrice}
              max={filters.maxPrice}
              value={priceRange[1]}
              onChange={(e) => handlePriceChange([priceRange[0], parseInt(e.target.value)])}
              className="w-full"
            />
          </div>
        </div>

        {/* Storage Options */}
        {filters.storageOptions.length > 0 && (
          <div className="mb-6">
            <h4 className="font-medium text-sm mb-3">Storage</h4>
            <div className="space-y-2">
              {filters.storageOptions.map((storage) => (
                <label key={storage} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={activeFilters.storage.includes(storage)}
                    onChange={() => handleStorageToggle(storage)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">{storage}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Colors */}
        {filters.colors.length > 0 && (
          <div className="mb-6">
            <h4 className="font-medium text-sm mb-3">Color</h4>
            <div className="flex flex-wrap gap-2">
              {filters.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorToggle(color)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    activeFilters.colors.includes(color) ? 'border-black' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}

        {/* Brands */}
        <div className="mb-6">
          <h4 className="font-medium text-sm mb-3">Brands</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {filters.brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/brand/${brand.slug}`}
                className="block text-sm text-gray-600 hover:text-black"
              >
                {brand.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}