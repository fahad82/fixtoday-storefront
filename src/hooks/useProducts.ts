// hooks/useProducts.ts
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { productService } from '../services/productService';
import { Product, Pagination, ProductFilters } from '../types';

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  pagination: Pagination;
  filters: ProductFilters;
  hasMore: boolean;
  isFirstLoad: boolean;
  fetchProducts: (page?: number) => Promise<void>;
  loadMore: () => Promise<void>;
  applyFilters: (newFilters: Partial<ProductFilters>) => void;
  resetFilters: () => void;
  setFilters: React.Dispatch<React.SetStateAction<ProductFilters>>;
  refetch: () => Promise<void>;
}

// Simple cache
const cache = new Map<string, { data: Product[]; pagination: Pagination; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const useProducts = (initialFilters: ProductFilters = {}): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProductFilters>(initialFilters);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);

  const latestFiltersRef = useRef(filters);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Generate cache key from filters
  const getCacheKey = useCallback((filters: ProductFilters, page: number): string => {
    const sorted = { ...filters, page, limit: pagination.limit };
    return JSON.stringify(sorted);
  }, [pagination.limit]);

  useEffect(() => {
    setFilters(initialFilters);
  }, [JSON.stringify(initialFilters)]);

  const fetchProducts = useCallback(
    async (page: number = 1): Promise<void> => {
      const currentFilters = filters;
      latestFiltersRef.current = currentFilters;

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      const cacheKey = getCacheKey(currentFilters, page);

      // Check cache for page 1
      if (page === 1 && cache.has(cacheKey)) {
        const cached = cache.get(cacheKey)!;
        if (Date.now() - cached.timestamp < CACHE_TTL) {
          setProducts(cached.data);
          setPagination(cached.pagination);
          setHasMore(cached.pagination.hasNext || false);
          setLoading(false);
          setIsFirstLoad(false);
          return;
        }
      }

      try {
        setLoading(true);
        setError(null);

        if (page === 1) {
          setProducts([]);
        }

        const response = await productService.getProducts({
          ...currentFilters,
          page,
          limit: pagination.limit,
        });

        if (latestFiltersRef.current !== currentFilters) {
          return;
        }

        const newProducts = response.products || [];
        const newPagination = response.pagination || {
          page,
          limit: pagination.limit,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        };

        // Cache only page 1 results
        if (page === 1) {
          cache.set(cacheKey, {
            data: newProducts,
            pagination: newPagination,
            timestamp: Date.now(),
          });
        }

        setProducts((prev) => (page === 1 ? newProducts : [...prev, ...newProducts]));
        setPagination({
          ...newPagination,
          page,
          limit: pagination.limit,
        });
        setHasMore(newPagination.hasNext || false);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        if (latestFiltersRef.current === currentFilters) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
          setError(errorMessage);
          console.error('Error fetching products:', err);
        }
      } finally {
        if (latestFiltersRef.current === currentFilters) {
          setLoading(false);
          setIsFirstLoad(false);
        }
      }
    },
    [filters, pagination.limit, getCacheKey]
  );

  const loadMore = useCallback(async (): Promise<void> => {
    if (loading || !hasMore) return;

    const nextPage = pagination.page + 1;
    if (nextPage > pagination.totalPages) {
      setHasMore(false);
      return;
    }

    await fetchProducts(nextPage);
  }, [loading, hasMore, pagination, fetchProducts]);

  const applyFilters = useCallback((newFilters: Partial<ProductFilters>): void => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setProducts([]);
    setPagination((prev) => ({ ...prev, page: 1 }));
    setHasMore(true);
    setIsFirstLoad(true);
    // Clear cache when filters change
    cache.clear();
  }, []);

  const resetFilters = useCallback((): void => {
    setFilters(initialFilters);
    setProducts([]);
    setPagination((prev) => ({ ...prev, page: 1 }));
    setHasMore(true);
    setIsFirstLoad(true);
    cache.clear();
  }, [initialFilters]);

  const refetch = useCallback(async (): Promise<void> => {
    cache.clear();
    await fetchProducts(1);
  }, [fetchProducts]);

  useEffect(() => {
    fetchProducts(1);
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [filters]);

  return {
    products,
    loading,
    error,
    pagination,
    filters,
    hasMore,
    isFirstLoad,
    fetchProducts,
    loadMore,
    applyFilters,
    resetFilters,
    setFilters,
    refetch,
  };
};