// services/filterService.ts
import { FilterOptions, AppliedFilters, ProductFilters } from '@/types/product.types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class FilterService {
  async getFilterOptions(categoryId?: string): Promise<FilterOptions> {
    try {
      const params = new URLSearchParams();
      if (categoryId) params.append('category_id', categoryId);
      
      const response = await fetch(`${API_BASE}/api/filters/options?${params}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data) {
        return data.data;
      }
      
      throw new Error(data.error || 'Failed to fetch filter options');
    } catch (error) {
      console.error('Error fetching filter options:', error);
      // Return default/empty options
      return this.getDefaultFilterOptions();
    }
  }

  getDefaultFilterOptions(): FilterOptions {
    return {
      brands: [],
      categories: [],
      minPrice: 0,
      maxPrice: 1000,
      storageOptions: [],
      ramOptions: [],
      colors: [],
      screenSizes: [],
      processors: [],
      batteryCapacities: [],
      cameraMegapixels: [],
      networkTypes: [],
      operatingSystems: [],
      refreshRates: [],
      chargingSpeeds: [],
      waterResistance: [],
      ratings: [1, 2, 3, 4, 5],
      availability: ['In Stock', 'Out of Stock'],
      sortOptions: [
        { value: 'created_at-DESC', label: 'Newest First' },
        { value: 'base_price-ASC', label: 'Price: Low to High' },
        { value: 'base_price-DESC', label: 'Price: High to Low' },
        { value: 'name-ASC', label: 'Name: A to Z' },
        { value: 'sale_count-DESC', label: 'Best Selling' },
        { value: 'view_count-DESC', label: 'Most Viewed' },
        { value: 'rating-DESC', label: 'Highest Rated' }
      ]
    };
  }

  async getFilteredProducts(filters: AppliedFilters & ProductFilters): Promise<any> {
    const params = new URLSearchParams();
    
    // Add all filter parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      
      if (Array.isArray(value)) {
        if (value.length > 0) {
          params.append(key, value.join(','));
        }
      } else if (typeof value === 'boolean') {
        params.append(key, value.toString());
      } else if (typeof value === 'string' && value.trim()) {
        params.append(key, value);
      } else if (typeof value === 'number') {
        params.append(key, value.toString());
      }
    });
    
    const response = await fetch(`${API_BASE}/api/products/filter?${params}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  // Extract filter options from products
  extractFilterOptions(products: any[], categories: any[], brands: any[]): FilterOptions {
    const storageSet = new Set<string>();
    const ramSet = new Set<string>();
    const colorSet = new Set<string>();
    const screenSizeSet = new Set<string>();
    const processorSet = new Set<string>();
    const batterySet = new Set<string>();
    const cameraSet = new Set<string>();
    const networkSet = new Set<string>();
    const osSet = new Set<string>();
    const refreshRateSet = new Set<string>();
    const chargingSet = new Set<string>();
    const waterResistanceSet = new Set<string>();
    
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    
    products.forEach(product => {
      // Price
      const price = product.sale_price || product.base_price;
      if (price < minPrice) minPrice = price;
      if (price > maxPrice) maxPrice = price;
      
      // Extract from specifications
      if (product.specifications) {
        try {
          let specs = product.specifications;
          if (typeof specs === 'string') {
            specs = JSON.parse(specs);
          }
          
          if (Array.isArray(specs)) {
            specs.forEach((spec: any) => {
              const name = (spec.name || '').toLowerCase();
              const value = spec.value || '';
              
              if (!value) return;
              
              if (name.includes('storage') || name.includes('capacity') || name.includes('internal')) {
                storageSet.add(value);
              } else if (name.includes('ram') || name.includes('memory')) {
                ramSet.add(value);
              } else if (name.includes('color')) {
                colorSet.add(value);
              } else if (name.includes('screen') && (name.includes('size') || name.includes('display'))) {
                screenSizeSet.add(value);
              } else if (name.includes('processor') || name.includes('chip') || name.includes('cpu')) {
                processorSet.add(value);
              } else if (name.includes('battery') || name.includes('mah')) {
                batterySet.add(value);
              } else if (name.includes('camera') || name.includes('mp') || name.includes('megapixel')) {
                cameraSet.add(value);
              } else if (name.includes('network') || name.includes('5g') || name.includes('4g')) {
                networkSet.add(value);
              } else if (name.includes('os') || name.includes('android') || name.includes('ios')) {
                osSet.add(value);
              } else if (name.includes('refresh') || name.includes('hz')) {
                refreshRateSet.add(value);
              } else if (name.includes('charging') || name.includes('watt') || name.includes('fast')) {
                chargingSet.add(value);
              } else if (name.includes('water') || name.includes('ip') || name.includes('resistance')) {
                waterResistanceSet.add(value);
              }
            });
          }
        } catch (e) {
          console.error('Error parsing specifications:', e);
        }
      }
      
      // Extract from phone_specs if available
      if (product.phone_specs) {
        try {
          const specs = typeof product.phone_specs === 'string' 
            ? JSON.parse(product.phone_specs) 
            : product.phone_specs;
          
          if (specs.storage) storageSet.add(specs.storage);
          if (specs.ram) ramSet.add(specs.ram);
          if (specs.colors) specs.colors.forEach((c: string) => colorSet.add(c));
          if (specs.screenSize) screenSizeSet.add(specs.screenSize);
          if (specs.processor) processorSet.add(specs.processor);
          if (specs.batteryCapacity) batterySet.add(specs.batteryCapacity);
          if (specs.rearCamera) cameraSet.add(specs.rearCamera);
          if (specs.network) networkSet.add(specs.network);
          if (specs.operatingSystem) osSet.add(specs.operatingSystem);
          if (specs.refreshRate) refreshRateSet.add(specs.refreshRate);
          if (specs.chargingSpeed) chargingSet.add(specs.chargingSpeed);
          if (specs.waterResistance) waterResistanceSet.add(specs.waterResistance);
        } catch (e) {
          console.error('Error parsing phone_specs:', e);
        }
      }
    });
    
    return {
      brands: brands || [],
      categories: categories || [],
      minPrice: minPrice === Infinity ? 0 : minPrice,
      maxPrice: maxPrice === -Infinity ? 1000 : maxPrice,
      storageOptions: Array.from(storageSet).filter(Boolean).sort(),
      ramOptions: Array.from(ramSet).filter(Boolean).sort(),
      colors: Array.from(colorSet).filter(Boolean).sort(),
      screenSizes: Array.from(screenSizeSet).filter(Boolean).sort(),
      processors: Array.from(processorSet).filter(Boolean).sort(),
      batteryCapacities: Array.from(batterySet).filter(Boolean).sort(),
      cameraMegapixels: Array.from(cameraSet).filter(Boolean).sort(),
      networkTypes: Array.from(networkSet).filter(Boolean).sort(),
      operatingSystems: Array.from(osSet).filter(Boolean).sort(),
      refreshRates: Array.from(refreshRateSet).filter(Boolean).sort(),
      chargingSpeeds: Array.from(chargingSet).filter(Boolean).sort(),
      waterResistance: Array.from(waterResistanceSet).filter(Boolean).sort(),
      ratings: [1, 2, 3, 4, 5],
      availability: ['In Stock', 'Out of Stock'],
      sortOptions: [
        { value: 'created_at-DESC', label: 'Newest First' },
        { value: 'base_price-ASC', label: 'Price: Low to High' },
        { value: 'base_price-DESC', label: 'Price: High to Low' },
        { value: 'name-ASC', label: 'Name: A to Z' },
        { value: 'sale_count-DESC', label: 'Best Selling' },
        { value: 'view_count-DESC', label: 'Most Viewed' },
        { value: 'rating-DESC', label: 'Highest Rated' }
      ]
    };
  }
}

export const filterService = new FilterService();