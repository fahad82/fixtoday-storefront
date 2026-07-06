// components/filters/FilterSidebar.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  FaSearch, 
  FaTimes, 
  FaChevronDown, 
  FaChevronUp,
  FaFilter,
  FaSlidersH,
  FaTag,
  FaStar,
  FaCog,
  FaMobileAlt,
  FaMemory,
  FaMicrochip,
  FaBatteryThreeQuarters,
  FaCamera,
  FaWifi,
  FaTachometerAlt,
  FaRuler,
  FaPalette,
  FaWater,
  FaBolt,
  FaCloud,FaCheck
} from 'react-icons/fa';


import { FilterOptions, AppliedFilters } from '@/types/product.types';

interface FilterSidebarProps {
  filters: FilterOptions;
  activeFilters: AppliedFilters;
  onFilterChange: (filters: Partial<AppliedFilters>) => void;
  onResetFilters: () => void;
  isMobile?: boolean;
  onClose?: () => void;
}

interface FilterSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
  showReset?: boolean;
  onReset?: () => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({ 
  title, 
  icon, 
  children, 
  isOpen = true, 
  onToggle,
  showReset = false,
  onReset
}) => {
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-3 px-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-gray-500">{icon}</span>}
          <span className="font-medium text-gray-700">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          {showReset && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReset?.();
              }}
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              Reset
            </button>
          )}
          {isOpen ? <FaChevronUp className="w-3 h-3 text-gray-400" /> : <FaChevronDown className="w-3 h-3 text-gray-400" />}
        </div>
      </button>
      {isOpen && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
};

interface RangeSliderProps {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  formatValue?: (value: number) => string;
}

const RangeSlider: React.FC<RangeSliderProps> = ({ 
  min, 
  max, 
  step = 1, 
  value, 
  onChange,
  formatValue = (v) => `£${v.toFixed(2)}`
}) => {
  const [localValue, setLocalValue] = useState<[number, number]>(value);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(parseInt(e.target.value), localValue[1] - step);
    const newValue: [number, number] = [newMin, localValue[1]];
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.max(parseInt(e.target.value), localValue[0] + step);
    const newValue: [number, number] = [localValue[0], newMax];
    setLocalValue(newValue);
    onChange(newValue);
  };

  const getPercentage = (val: number) => ((val - min) / (max - min)) * 100;

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm text-gray-600">
        <span>{formatValue(localValue[0])}</span>
        <span>{formatValue(localValue[1])}</span>
      </div>
      <div className="relative pt-1">
        <div 
          ref={trackRef}
          className="h-1 bg-gray-200 rounded-full relative"
        >
          <div 
            className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full absolute top-0"
            style={{
              left: `${getPercentage(localValue[0])}%`,
              right: `${100 - getPercentage(localValue[1])}%`
            }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue[0]}
          onChange={handleMinChange}
          className="absolute w-full top-0 h-1 bg-transparent pointer-events-none appearance-none"
          style={{ zIndex: 2 }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue[1]}
          onChange={handleMaxChange}
          className="absolute w-full top-0 h-1 bg-transparent pointer-events-none appearance-none"
          style={{ zIndex: 2 }}
        />
        <div className="absolute -top-2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full"
          style={{ left: `calc(${getPercentage(localValue[0])}% - 8px)`, zIndex: 3 }}
        />
        <div className="absolute -top-2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full"
          style={{ left: `calc(${getPercentage(localValue[1])}% - 8px)`, zIndex: 3 }}
        />
      </div>
      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          background: transparent;
          cursor: pointer;
          pointer-events: auto;
        }
        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: transparent;
          cursor: pointer;
          pointer-events: auto;
          border: none;
        }
      `}</style>
    </div>
  );
};

interface CheckboxGroupProps {
  options: string[];
  selected: string[];
  onChange: (value: string) => void;
  maxDisplay?: number;
  colorSwatches?: Record<string, string>;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ 
  options, 
  selected, 
  onChange,
  maxDisplay = 5,
  colorSwatches = {}
}) => {
  const [showAll, setShowAll] = useState(false);
  const displayOptions = showAll ? options : options.slice(0, maxDisplay);

  if (options.length === 0) return null;

  return (
    <div className="space-y-2">
      {displayOptions.map((option) => (
        <label key={option} className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={selected.includes(option)}
            onChange={() => onChange(option)}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 transition-all"
          />
          {colorSwatches[option] ? (
            <div className="flex items-center gap-2">
              <div 
                className="w-5 h-5 rounded-full border border-gray-200 shadow-sm"
                style={{ backgroundColor: colorSwatches[option] }}
              />
              <span className="text-sm text-gray-700 capitalize">{option}</span>
            </div>
          ) : (
            <span className="text-sm text-gray-700 capitalize">{option}</span>
          )}
        </label>
      ))}
      {options.length > maxDisplay && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {showAll ? 'Show less' : `Show ${options.length - maxDisplay} more`}
        </button>
      )}
    </div>
  );
};

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  activeFilters,
  onFilterChange,
  onResetFilters,
  isMobile = false,
  onClose
}) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    categories: true,
    brands: true,
    price: true,
    storage: true,
    ram: true,
    colors: true,
    screenSize: true,
    processor: true,
    battery: true,
    camera: true,
    network: true,
    os: true,
    refreshRate: true,
    chargingSpeed: true,
    waterResistance: true,
    rating: true,
    availability: true
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCheckboxToggle = (filterKey: keyof AppliedFilters, value: string) => {
    const current = activeFilters[filterKey] as string[] || [];
    const newValue = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    onFilterChange({ [filterKey]: newValue });
  };

  const handleRatingChange = (rating: number) => {
    if (activeFilters.rating === rating) {
      onFilterChange({ rating: undefined });
    } else {
      onFilterChange({ rating });
    }
  };

  const activeFiltersCount = () => {
    let count = 0;
    const filterKeys: (keyof AppliedFilters)[] = [
      'brand_id', 'category_id', 'storage', 'ram', 'colors', 
      'screenSize', 'processor', 'batteryCapacity', 'camera',
      'network', 'os', 'refreshRate', 'chargingSpeed', 
      'waterResistance', 'rating', 'inStock'
    ];
    
    filterKeys.forEach(key => {
      if (key === 'brand_id' && activeFilters.brand_id) count++;
      else if (key === 'category_id' && activeFilters.category_id) count++;
      else if (key === 'inStock' && activeFilters.inStock) count++;
      else if (key === 'rating' && activeFilters.rating) count++;
      else if (Array.isArray(activeFilters[key]) && activeFilters[key].length > 0) {
        count += (activeFilters[key] as string[]).length;
      }
    });
    
    return count;
  };

  return (
    <div className={`${isMobile ? 'w-full' : 'w-72'} bg-white rounded-xl shadow-sm border border-gray-200`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaFilter className="w-4 h-4 text-gray-600" />
          <h3 className="font-semibold text-gray-800">Filters</h3>
          <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
            {activeFiltersCount()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onResetFilters}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Reset All
          </button>
          {isMobile && onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaTimes className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Sections */}
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
        {/* Category Filter */}
        {filters.categories && filters.categories.length > 0 && (
          <FilterSection
            title="Category"
            icon={<FaTag className="w-4 h-4" />}
            isOpen={openSections.categories}
            onToggle={() => toggleSection('categories')}
            showReset={!!activeFilters.category_id}
            onReset={() => onFilterChange({ category_id: undefined })}
          >
            <div className="space-y-2">
              {filters.categories.map((category) => (
                <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    checked={activeFilters.category_id === category.id}
                    onChange={() => onFilterChange({ category_id: category.id })}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{category.name}</span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Brand Filter */}
        {filters.brands && filters.brands.length > 0 && (
          <FilterSection
            title="Brand"
            icon={<FaTag className="w-4 h-4" />}
            isOpen={openSections.brands}
            onToggle={() => toggleSection('brands')}
            showReset={!!activeFilters.brand_id}
            onReset={() => onFilterChange({ brand_id: undefined })}
          >
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {filters.brands.map((brand) => (
                <label key={brand.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="brand"
                    checked={activeFilters.brand_id === brand.id}
                    onChange={() => onFilterChange({ brand_id: brand.id })}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  {brand.logo ? (
                    <div className="flex items-center gap-2">
                      <img src={brand.logo} alt={brand.name} className="w-6 h-6 object-contain" />
                      <span className="text-sm text-gray-700">{brand.name}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-700">{brand.name}</span>
                  )}
                </label>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Price Range */}
        <FilterSection
          title="Price Range"
          icon={<FaSlidersH className="w-4 h-4" />}
          isOpen={openSections.price}
          onToggle={() => toggleSection('price')}
          showReset={activeFilters.minPrice > filters.minPrice || activeFilters.maxPrice < filters.maxPrice}
          onReset={() => onFilterChange({ 
            minPrice: filters.minPrice, 
            maxPrice: filters.maxPrice 
          })}
        >
          <RangeSlider
            min={filters.minPrice}
            max={filters.maxPrice}
            step={10}
            value={[activeFilters.minPrice, activeFilters.maxPrice]}
            onChange={([min, max]) => onFilterChange({ minPrice: min, maxPrice: max })}
            formatValue={(v) => `£${v.toFixed(0)}`}
          />
        </FilterSection>

        {/* Storage */}
        {filters.storageOptions && filters.storageOptions.length > 0 && (
          <FilterSection
            title="Storage"
            icon={<FaMemory className="w-4 h-4" />}
            isOpen={openSections.storage}
            onToggle={() => toggleSection('storage')}
            showReset={activeFilters.storage && activeFilters.storage.length > 0}
            onReset={() => onFilterChange({ storage: [] })}
          >
            <CheckboxGroup
              options={filters.storageOptions}
              selected={activeFilters.storage || []}
              onChange={(value) => handleCheckboxToggle('storage', value)}
            />
          </FilterSection>
        )}

        {/* RAM */}
        {filters.ramOptions && filters.ramOptions.length > 0 && (
          <FilterSection
            title="RAM"
            icon={<FaMicrochip className="w-4 h-4" />}
            isOpen={openSections.ram}
            onToggle={() => toggleSection('ram')}
            showReset={activeFilters.ram && activeFilters.ram.length > 0}
            onReset={() => onFilterChange({ ram: [] })}
          >
            <CheckboxGroup
              options={filters.ramOptions}
              selected={activeFilters.ram || []}
              onChange={(value) => handleCheckboxToggle('ram', value)}
            />
          </FilterSection>
        )}

        {/* Colors */}
        {filters.colors && filters.colors.length > 0 && (
          <FilterSection
            title="Colors"
            icon={<FaPalette className="w-4 h-4" />}
            isOpen={openSections.colors}
            onToggle={() => toggleSection('colors')}
            showReset={activeFilters.colors && activeFilters.colors.length > 0}
            onReset={() => onFilterChange({ colors: [] })}
          >
            <div className="flex flex-wrap gap-2">
              {filters.colors.map((color) => {
                const colorMap: Record<string, string> = {
                  'Black': '#1a1a1a',
                  'White': '#ffffff',
                  'Blue': '#2563eb',
                  'Red': '#dc2626',
                  'Green': '#16a34a',
                  'Yellow': '#eab308',
                  'Purple': '#9333ea',
                  'Pink': '#ec4899',
                  'Orange': '#f97316',
                  'Gray': '#6b7280',
                  'Gold': '#f59e0b',
                  'Silver': '#9ca3af',
                  'Rose Gold': '#f3a4a4',
                  'Midnight': '#1e293b',
                  'Starlight': '#faf0e6'
                };
                const bgColor = colorMap[color] || '#ccc';
                const isSelected = activeFilters.colors?.includes(color) || false;
                
                return (
                  <button
                    key={color}
                    onClick={() => handleCheckboxToggle('colors', color)}
                    className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                      isSelected ? 'border-blue-600 ring-2 ring-blue-200 ring-offset-2' : 'border-gray-200 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: bgColor }}
                    title={color}
                  >
                    {isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FaCheck className="w-4 h-4 text-white drop-shadow-lg" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </FilterSection>
        )}

        {/* Screen Size */}
        {filters.screenSizes && filters.screenSizes.length > 0 && (
          <FilterSection
            title="Screen Size"
            icon={<FaRuler className="w-4 h-4" />}
            isOpen={openSections.screenSize}
            onToggle={() => toggleSection('screenSize')}
            showReset={activeFilters.screenSize && activeFilters.screenSize.length > 0}
            onReset={() => onFilterChange({ screenSize: [] })}
          >
            <CheckboxGroup
              options={filters.screenSizes}
              selected={activeFilters.screenSize || []}
              onChange={(value) => handleCheckboxToggle('screenSize', value)}
            />
          </FilterSection>
        )}

        {/* Processor */}
        {filters.processors && filters.processors.length > 0 && (
          <FilterSection
            title="Processor"
            icon={<FaMicrochip className="w-4 h-4" />}
            isOpen={openSections.processor}
            onToggle={() => toggleSection('processor')}
            showReset={activeFilters.processor && activeFilters.processor.length > 0}
            onReset={() => onFilterChange({ processor: [] })}
          >
            <CheckboxGroup
              options={filters.processors}
              selected={activeFilters.processor || []}
              onChange={(value) => handleCheckboxToggle('processor', value)}
            />
          </FilterSection>
        )}

        {/* Battery Capacity */}
        {filters.batteryCapacities && filters.batteryCapacities.length > 0 && (
          <FilterSection
            title="Battery Capacity"
            icon={<FaBatteryThreeQuarters className="w-4 h-4" />}
            isOpen={openSections.battery}
            onToggle={() => toggleSection('battery')}
            showReset={activeFilters.batteryCapacity && activeFilters.batteryCapacity.length > 0}
            onReset={() => onFilterChange({ batteryCapacity: [] })}
          >
            <CheckboxGroup
              options={filters.batteryCapacities}
              selected={activeFilters.batteryCapacity || []}
              onChange={(value) => handleCheckboxToggle('batteryCapacity', value)}
            />
          </FilterSection>
        )}

        {/* Camera */}
        {filters.cameraMegapixels && filters.cameraMegapixels.length > 0 && (
          <FilterSection
            title="Camera"
            icon={<FaCamera className="w-4 h-4" />}
            isOpen={openSections.camera}
            onToggle={() => toggleSection('camera')}
            showReset={activeFilters.camera && activeFilters.camera.length > 0}
            onReset={() => onFilterChange({ camera: [] })}
          >
            <CheckboxGroup
              options={filters.cameraMegapixels}
              selected={activeFilters.camera || []}
              onChange={(value) => handleCheckboxToggle('camera', value)}
            />
          </FilterSection>
        )}

        {/* Network */}
        {filters.networkTypes && filters.networkTypes.length > 0 && (
          <FilterSection
            title="Network"
            icon={<FaWifi className="w-4 h-4" />}
            isOpen={openSections.network}
            onToggle={() => toggleSection('network')}
            showReset={activeFilters.network && activeFilters.network.length > 0}
            onReset={() => onFilterChange({ network: [] })}
          >
            <CheckboxGroup
              options={filters.networkTypes}
              selected={activeFilters.network || []}
              onChange={(value) => handleCheckboxToggle('network', value)}
            />
          </FilterSection>
        )}

        {/* Operating System */}
        {filters.operatingSystems && filters.operatingSystems.length > 0 && (
          <FilterSection
            title="Operating System"
            icon={<FaMobileAlt className="w-4 h-4" />}
            isOpen={openSections.os}
            onToggle={() => toggleSection('os')}
            showReset={activeFilters.os && activeFilters.os.length > 0}
            onReset={() => onFilterChange({ os: [] })}
          >
            <CheckboxGroup
              options={filters.operatingSystems}
              selected={activeFilters.os || []}
              onChange={(value) => handleCheckboxToggle('os', value)}
            />
          </FilterSection>
        )}

        {/* Refresh Rate */}
        {filters.refreshRates && filters.refreshRates.length > 0 && (
          <FilterSection
            title="Refresh Rate"
            icon={<FaTachometerAlt className="w-4 h-4" />}
            isOpen={openSections.refreshRate}
            onToggle={() => toggleSection('refreshRate')}
            showReset={activeFilters.refreshRate && activeFilters.refreshRate.length > 0}
            onReset={() => onFilterChange({ refreshRate: [] })}
          >
            <CheckboxGroup
              options={filters.refreshRates}
              selected={activeFilters.refreshRate || []}
              onChange={(value) => handleCheckboxToggle('refreshRate', value)}
            />
          </FilterSection>
        )}

        {/* Charging Speed */}
        {filters.chargingSpeeds && filters.chargingSpeeds.length > 0 && (
          <FilterSection
            title="Charging Speed"
            icon={<FaBolt className="w-4 h-4" />}
            isOpen={openSections.chargingSpeed}
            onToggle={() => toggleSection('chargingSpeed')}
            showReset={activeFilters.chargingSpeed && activeFilters.chargingSpeed.length > 0}
            onReset={() => onFilterChange({ chargingSpeed: [] })}
          >
            <CheckboxGroup
              options={filters.chargingSpeeds}
              selected={activeFilters.chargingSpeed || []}
              onChange={(value) => handleCheckboxToggle('chargingSpeed', value)}
            />
          </FilterSection>
        )}

        {/* Water Resistance */}
        {filters.waterResistance && filters.waterResistance.length > 0 && (
          <FilterSection
            title="Water Resistance"
            icon={<FaWater className="w-4 h-4" />}
            isOpen={openSections.waterResistance}
            onToggle={() => toggleSection('waterResistance')}
            showReset={activeFilters.waterResistance && activeFilters.waterResistance.length > 0}
            onReset={() => onFilterChange({ waterResistance: [] })}
          >
            <CheckboxGroup
              options={filters.waterResistance}
              selected={activeFilters.waterResistance || []}
              onChange={(value) => handleCheckboxToggle('waterResistance', value)}
            />
          </FilterSection>
        )}

        {/* Rating */}
        <FilterSection
          title="Rating"
          icon={<FaStar className="w-4 h-4" />}
          isOpen={openSections.rating}
          onToggle={() => toggleSection('rating')}
          showReset={!!activeFilters.rating}
          onReset={() => onFilterChange({ rating: undefined })}
        >
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <label key={star} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  checked={activeFilters.rating === star}
                  onChange={() => handleRatingChange(star)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`w-4 h-4 ${i < star ? 'text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">& up</span>
                </div>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Availability */}
        <FilterSection
          title="Availability"
          icon={<FaCloud className="w-4 h-4" />}
          isOpen={openSections.availability}
          onToggle={() => toggleSection('availability')}
          showReset={!!activeFilters.inStock}
          onReset={() => onFilterChange({ inStock: undefined })}
        >
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={activeFilters.inStock || false}
              onChange={(e) => onFilterChange({ inStock: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-sm text-gray-700">In Stock Only</span>
          </label>
        </FilterSection>
      </div>

      {/* Footer with Apply/Clear buttons */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
        <div className="flex gap-2">
          <button
            onClick={onResetFilters}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Clear All
          </button>
          <button
            onClick={() => {
              if (isMobile && onClose) onClose();
            }}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
          >
            Apply Filters
          </button>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
};


export default FilterSidebar;