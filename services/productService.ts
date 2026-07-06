// services/productService.ts
import { Product, ProductsResponse, ProductFilters } from '@/types/product.types';

class ProductService {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  }

  private parseProductNumbers(product: any): Product {
    return {
      ...product,
      base_price: typeof product.base_price === 'number' ? product.base_price : parseFloat(product.base_price) || 0,
      sale_price: product.sale_price ? (typeof product.sale_price === 'number' ? product.sale_price : parseFloat(product.sale_price) || null) : null,
      cost_price: product.cost_price ? (typeof product.cost_price === 'number' ? product.cost_price : parseFloat(product.cost_price) || null) : null,
      stock_quantity: typeof product.stock_quantity === 'number' ? product.stock_quantity : parseInt(product.stock_quantity) || 0,
      weight: product.weight ? (typeof product.weight === 'number' ? product.weight : parseFloat(product.weight) || null) : null,
    };
  }

  async getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
    const {
      brand_id,
      category,
      search,
      min_price,
      max_price,
      status = 'active',
      featured,
      page = 1,
      limit = 12,
      sortBy = 'created_at',
      sortOrder = 'DESC',
      collection_id,
      // Advanced filters
      storage,
      ram,
      colors,
      screen_size,
      processor,
      battery,
      camera,
      network,
      os,
      refresh_rate,
      charging,
      water_resistance,
      in_stock,
      rating
    } = filters;

    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder,
      ...(status && { status }),
      ...(featured !== undefined && { featured: featured.toString() }),
      ...(search && { search }),
      ...(min_price && { min_price: min_price.toString() }),
      ...(max_price && { max_price: max_price.toString() }),
      ...(brand_id && { brand_id }),
      ...(category && { category_id: category }),
      ...(collection_id && { collection_id }),
      // Advanced filters
      ...(storage && { storage }),
      ...(ram && { ram }),
      ...(colors && { colors }),
      ...(screen_size && { screen_size }),
      ...(processor && { processor }),
      ...(battery && { battery }),
      ...(camera && { camera }),
      ...(network && { network }),
      ...(os && { os }),
      ...(refresh_rate && { refresh_rate }),
      ...(charging && { charging }),
      ...(water_resistance && { water_resistance }),
      ...(in_stock !== undefined && { in_stock: in_stock.toString() }),
      ...(rating && { rating: rating.toString() })
    });

    try {
      const response = await fetch(`${this.baseURL}/api/products/filter?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        return {
          success: true,
          products: data.products.map((product: any) => this.parseProductNumbers(product)),
          pagination: data.pagination
        };
      }
      throw new Error(data.error || 'Failed to fetch products');
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to regular products endpoint
      try {
        const fallbackParams = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          sortBy,
          sortOrder,
          ...(status && { status }),
          ...(search && { search }),
          ...(min_price && { min_price: min_price.toString() }),
          ...(max_price && { max_price: max_price.toString() }),
          ...(brand_id && { brand_id }),
        });
        
        const fallbackResponse = await fetch(`${this.baseURL}/api/products?${fallbackParams}`);
        const fallbackData = await fallbackResponse.json();
        
        if (fallbackData.success) {
          return {
            success: true,
            products: fallbackData.products.map((product: any) => this.parseProductNumbers(product)),
            pagination: fallbackData.pagination
          };
        }
      } catch (fallbackError) {
        console.error('Fallback fetch failed:', fallbackError);
      }
      
      throw error;
    }
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      const response = await fetch(`${this.baseURL}/api/products/slug/${slug}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        return this.parseProductNumbers(data.product);
      }
      throw new Error(data.error || 'Product not found');
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      const response = await fetch(`${this.baseURL}/api/products/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        return this.parseProductNumbers(data.product);
      }
      throw new Error(data.error || 'Product not found');
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }
}

export const productService = new ProductService();