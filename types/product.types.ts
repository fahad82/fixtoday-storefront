// types/product.types.ts
export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  description: string | null;
  short_description: string | null;
  base_price: number;
  sale_price: number | null;
  cost_price: number | null;
  track_inventory: boolean;
  inventory_management: 'simple' | 'variant';
  stock_quantity: number;
  low_stock_threshold: number;
  brand_id: string | null;
  category_id: string | null;
  collection_ids: string[];
  main_image: string | null;
  main_image_public_id: string | null;
  gallery_images: string[];
  has_variants: boolean;
  variant_options: VariantOption[];
  variants: ProductVariant[];
  specifications: Specification[];
  seo: SEOData;
  status: 'draft' | 'active' | 'inactive' | 'out_of_stock';
  featured: boolean;
  sort_order: number;
  weight: number | null;
  weight_unit: string;
  dimensions: Dimensions;
  view_count: number;
  sale_count: number;
  created_at: string;
  updated_at: string;
  // Joined fields
  brand_name?: string;
  brand_logo?: string;
  category_name?: string;
  category_image?: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  description: string | null;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  attributes: Record<string, string>;
  price: number | null;
  sale_price: number | null;
  stock_quantity: number;
  image: string | null;
  position: number;
  status: 'active' | 'inactive' | 'out_of_stock';
}

export interface VariantOption {
  id: string;
  name: string;
  display_name: string;
  values: string[];
}

export interface Specification {
  name: string;
  value: string;
  display_order?: number;
}

export interface SEOData {
  metaTitle: string | null;
  metaDescription: string | null;
  keywords: string[];
}

export interface Dimensions {
  length: number;
  width: number;
  height: number;
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ProductsResponse {
  success: boolean;
  products: Product[];
  pagination: PaginationData;
}

export interface ProductFilters {
  brand_id?: string;
  category?: string;
  search?: string;
  min_price?: number | string;
  max_price?: number | string;
  status?: 'active' | 'draft' | 'inactive' | 'out_of_stock';
  featured?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  collection_id?: string;
}

// types/product.types.ts (add missing types)
export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  products_count?: number;
  status: 'draft' | 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  products?: Product[];
  brands?: Brand[];
  collections?: Collection[];
  pagination?: PaginationData;
}