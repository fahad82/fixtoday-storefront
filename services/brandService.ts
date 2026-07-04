// services/brandService.ts
import { Brand } from '@/types/product.types';

class BrandService {
  private baseURL: string;
  private brandsCache: Brand[] | null = null;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://api.fixtoday.co.uk';
  }

  async getBrands(): Promise<Brand[]> {
    // Return cached brands if available
    if (this.brandsCache) {
      return this.brandsCache;
    }

    try {
      const response = await fetch(`${this.baseURL}/api/brands?status=active&limit=100`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.brands) {
        this.brandsCache = data.brands;

        return this.brandsCache ?? [];

      }
      
      return [];
    } catch (error) {
      console.error('Error fetching brands:', error);
      return [];
    }
  }

  async getBrandBySlug(slug: string): Promise<Brand | null> {
    const brands = await this.getBrands();
    return brands.find(brand => brand.slug === slug) || null;
  }

  async getBrandById(id: string): Promise<Brand | null> {
    const brands = await this.getBrands();
    return brands.find(brand => brand.id === id) || null;
  }
}

export const brandService = new BrandService();