// src/services/categoryService.ts
import { api } from './api';
import { Category } from '../types';

export const categoryService = {
  async getCategories(params: { status?: string; tree?: boolean; limit?: number } = {}): Promise<Category[]> {
    try {
      if (params.tree === true) {
        try {
          const response = await api.get<{ success: boolean; tree: Category[] }>(
            '/api/categories/tree'
          );
          if (response && response.tree) {
            return response.tree;
          }
        } catch (treeError) {
          console.warn('Tree endpoint failed, falling back to flat list:', treeError);
        }
      }
      
      const response = await api.get<{ success: boolean; categories: Category[]; pagination: any }>(
        '/api/categories',
        {
          status: 'publish',
          limit: params.limit || 100,
          ...params,
        }
      );
      
      if (response && response.categories) {
        if (params.tree === true) {
          return this.buildTree(response.categories);
        }
        return response.categories;
      }
      
      return [];
    } catch (error) {
      console.warn('Error fetching categories, using fallback:', error);
      return this.getFallbackCategories();
    }
  },

  buildTree(categories: Category[], parentId: string | null = null): Category[] {
    return categories
      .filter(cat => {
        if (parentId === null) {
          return cat.parent_id === null || cat.parent_id === undefined;
        }
        return cat.parent_id === parentId;
      })
      .map(cat => ({
        ...cat,
        children: this.buildTree(categories, cat.id)
      }));
  },

  getFallbackCategories(): Category[] {
    return [
      { id: '1', name: 'Electronics', slug: 'electronics', description: null, parent_id: null, image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=100&h=100&fit=crop', image_public_id: null, seo: { metaTitle: null, metaDescription: null, keywords: [] }, status: 'publish', level: 0, path: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: '2', name: 'Fashion', slug: 'fashion', description: null, parent_id: null, image: 'https://images.unsplash.com/photo-1445205170230-053b2451604c?w=100&h=100&fit=crop', image_public_id: null, seo: { metaTitle: null, metaDescription: null, keywords: [] }, status: 'publish', level: 0, path: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: '3', name: 'Home & Living', slug: 'home-living', description: null, parent_id: null, image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=100&h=100&fit=crop', image_public_id: null, seo: { metaTitle: null, metaDescription: null, keywords: [] }, status: 'publish', level: 0, path: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: '4', name: 'Beauty', slug: 'beauty', description: null, parent_id: null, image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=100&h=100&fit=crop', image_public_id: null, seo: { metaTitle: null, metaDescription: null, keywords: [] }, status: 'publish', level: 0, path: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: '5', name: 'Sports', slug: 'sports', description: null, parent_id: null, image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=100&h=100&fit=crop', image_public_id: null, seo: { metaTitle: null, metaDescription: null, keywords: [] }, status: 'publish', level: 0, path: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    ];
  },

  async getCategoryTree(): Promise<Category[]> {
    try {
      const response = await api.get<{ success: boolean; tree: Category[] }>(
        '/api/categories/tree'
      );
      return response.tree || [];
    } catch (error) {
      console.warn('Error fetching category tree, using flat list:', error);
      const categories = await this.getCategories({ tree: false, limit: 100 });
      return this.buildTree(categories);
    }
  },

  async getCategoryDropdown(search?: string): Promise<{ value: string; label: string; image: string | null }[]> {
    try {
      const response = await api.get<{ success: boolean; options: any[] }>(
        '/api/categories/dropdown',
        { search }
      );
      return response.options || [];
    } catch (error) {
      console.warn('Error fetching category dropdown:', error);
      return [];
    }
  },

  async getCategory(id: string): Promise<Category | null> {
    try {
      const response = await api.get<{ success: boolean; category: Category }>(
        `/api/categories/${id}`
      );
      return response.category || null;
    } catch (error) {
      console.warn(`Error fetching category ${id}:`, error);
      return null;
    }
  },
};