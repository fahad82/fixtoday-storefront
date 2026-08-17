// services/brandService.ts
import { api } from './api';
import { Brand } from '../types';

export const brandService = {
  async getBrands(params: { status?: string; featured?: boolean; search?: string } = {}): Promise<Brand[]> {
    const response = await api.get<{ success: boolean; brands: Brand[] }>('/api/brands', {
      status: 'active',
      ...params,
    });
    return response.brands;
  },

  async getFeaturedBrands(limit: number = 10): Promise<Brand[]> {
    const response = await api.get<{ success: boolean; brands: Brand[] }>(
      '/api/brands/featured',
      { limit }
    );
    return response.brands;
  },

  async getBrandDropdown(search?: string): Promise<{ value: string; label: string; image: string | null }[]> {
    const response = await api.get<{ success: boolean; options: any[] }>(
      '/api/brands/dropdown',
      { search }
    );
    return response.options;
  },
};