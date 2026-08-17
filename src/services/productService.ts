// services/productService.ts
import { api } from './api';
import { Product, ProductsResponse, ProductFilters, FilterOptions } from '../types';

export const productService = {
  async getProducts(params: ProductFilters = {}): Promise<ProductsResponse> {
    const response = await api.get<ProductsResponse>('/api/products', {
      status: 'active',
      ...params,
    });
    return response;
  },

  async getProductBySlug(slug: string): Promise<Product> {
    console.log('🔍 productService.getProductBySlug called with slug:', slug);
    
    try {
      const response = await api.get<any>(`/api/products/slug/${slug}`);
      console.log('📦 Raw API response:', response);
      
      // Check if response is already the product
      if (response && response.id) {
        console.log('✅ Response is direct product object');
        return response as Product;
      }
      
      // Check if response has a product property
      if (response && response.product && response.product.id) {
        console.log('✅ Response has product property');
        return response.product;
      }
      
      // Check if response has success and product
      if (response && response.success && response.product) {
        console.log('✅ Response has success and product');
        return response.product;
      }
      
      console.error('❌ Unexpected response structure:', response);
      throw new Error('Invalid product response structure');
    } catch (error) {
      console.error('❌ Error in getProductBySlug:', error);
      throw error;
    }
  },

  async getProductById(id: string): Promise<Product> {
    const response = await api.get<{ success: boolean; product: Product }>(
      `/api/products/${id}`
    );
    return response.product;
  },

  async getFilterOptions(categoryId?: string): Promise<FilterOptions> {
    const params = categoryId ? { category_id: categoryId } : {};
    const response = await api.get<{ success: boolean; data: FilterOptions }>(
      '/api/filters/options',
      params
    );
    return response.data;
  },

  async getFilteredProducts(
    filters: Record<string, any>,
    page: number = 1,
    limit: number = 12
  ): Promise<ProductsResponse> {
    const response = await api.get<ProductsResponse>('/api/products/filter', {
      ...filters,
      page,
      limit,
    });
    return response;
  },
};