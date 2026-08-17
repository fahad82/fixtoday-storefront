// hooks/useFilters.ts
import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/productService';
import { FilterOptions } from '../types';

interface UseFiltersReturn {
  filterOptions: FilterOptions;
  loading: boolean;
  error: string | null;
  fetchFilters: () => Promise<void>;
}

export const useFilters = (categoryId?: string): UseFiltersReturn => {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
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
    sortOptions: [],
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFilters = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getFilterOptions(categoryId);
      setFilterOptions(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch filters';
      setError(errorMessage);
      console.error('Error fetching filters:', err);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchFilters();
  }, [fetchFilters]);

  return {
    filterOptions,
    loading,
    error,
    fetchFilters,
  };
};