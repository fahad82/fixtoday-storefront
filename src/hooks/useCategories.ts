// src/hooks/useCategories.ts
"use client";

import { useState, useEffect, useCallback } from 'react';
import { categoryService } from '../services/categoryService';
import { Category } from '../types';

interface UseCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
  selectedCategory: string | null;
  selectCategory: (categoryId: string | null) => void;
  clearSelectedCategory: () => void;
  fetchCategories: () => Promise<void>;
}

export const useCategories = (): UseCategoriesReturn => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const fetchCategories = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to get categories with tree
      let data: Category[] = [];
      try {
        data = await categoryService.getCategories({ tree: true, limit: 100 });
      } catch (treeErr) {
        console.warn('Tree fetch failed, using flat list:', treeErr);
        // Fallback to flat list
        data = await categoryService.getCategories({ tree: false, limit: 100 });
      }
      
      setCategories(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch categories';
      setError(errorMessage);
      console.error('Error fetching categories:', err);
      
      // Set fallback categories
      setCategories([
        { id: '1', name: 'Electronics', slug: 'electronics', description: null, parent_id: null, image: null, image_public_id: null, seo: { metaTitle: null, metaDescription: null, keywords: [] }, status: 'publish', level: 0, path: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '2', name: 'Fashion', slug: 'fashion', description: null, parent_id: null, image: null, image_public_id: null, seo: { metaTitle: null, metaDescription: null, keywords: [] }, status: 'publish', level: 0, path: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '3', name: 'Home & Living', slug: 'home-living', description: null, parent_id: null, image: null, image_public_id: null, seo: { metaTitle: null, metaDescription: null, keywords: [] }, status: 'publish', level: 0, path: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '4', name: 'Beauty', slug: 'beauty', description: null, parent_id: null, image: null, image_public_id: null, seo: { metaTitle: null, metaDescription: null, keywords: [] }, status: 'publish', level: 0, path: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '5', name: 'Sports', slug: 'sports', description: null, parent_id: null, image: null, image_public_id: null, seo: { metaTitle: null, metaDescription: null, keywords: [] }, status: 'publish', level: 0, path: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const selectCategory = (categoryId: string | null): void => {
    setSelectedCategory(categoryId);
  };

  const clearSelectedCategory = (): void => {
    setSelectedCategory(null);
  };

  return {
    categories,
    loading,
    error,
    selectedCategory,
    selectCategory,
    clearSelectedCategory,
    fetchCategories,
  };
};