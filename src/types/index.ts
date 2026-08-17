// types/index.ts

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
  stock_quantity: number;
  low_stock_threshold: number;
  track_inventory: boolean;
  inventory_management: 'simple' | 'variant';
  brand_id: string | null;
  category_id: string | null;
  collection_ids: string[];
  main_image: string | null;
  main_image_public_id: string | null;
  gallery_images: string[];
  has_variants: boolean;
  variant_options: VariantOption[];
  variants: Variant[];
  specifications: Specification[];
  seo: SeoData;
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

export interface Variant {
  id: string;
  sku: string;
  name: string;
  image: string | null;
  image_public_id: string | null;
  gallery_images: string[];
  price: number;
  sale_price: number | null;
  cost_price: number | null;
  stock_quantity: number;
  low_stock_threshold: number;
  attributes: Record<string, string>;
  status: 'active' | 'inactive' | 'out_of_stock';
  is_default: boolean;
  sort_order: number;
  weight: number | null;
  dimensions: Dimensions;
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
}

export interface SeoData {
  metaTitle: string | null;
  metaDescription: string | null;
  keywords: string[];
}

export interface Dimensions {
  length: number;
  width: number;
  height: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  image: string | null;
  image_public_id: string | null;
  seo: SeoData;
  status: 'publish' | 'hide';
  level: number;
  path: string[] | null;
  created_at: string;
  updated_at: string;
  parent_name?: string;
  child_count?: number;
  children?: Category[];
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  logo_public_id: string | null;
  banner_image: string | null;
  banner_public_id: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  seo: SeoData;
  status: 'active' | 'inactive';
  featured: boolean;
  sort_order: number;
  product_count: number;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice: number;
  image: string | null;
  quantity: number;
  selectedOptions: Record<string, string>;
  sku: string | null;
  stock: number;
  variantId?: string;
}

export interface WishlistItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string | null;
  addedAt: string;
}

export interface FilterOptions {
  brands: Brand[];
  categories: Category[];
  minPrice: number;
  maxPrice: number;
  storageOptions: string[];
  ramOptions: string[];
  colors: string[];
  screenSizes: string[];
  processors: string[];
  batteryCapacities: string[];
  cameraMegapixels: string[];
  networkTypes: string[];
  operatingSystems: string[];
  refreshRates: string[];
  chargingSpeeds: string[];
  waterResistance: string[];
  ratings: number[];
  sortOptions: SortOption[];
}

export interface SortOption {
  value: string;
  label: string;
}

export interface Pagination {
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
  pagination: Pagination;
  filters?: Record<string, any>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ProductFilters {
  status?: string;
  featured?: boolean | string;
  brand_id?: string;
  category_id?: string;
  collection_id?: string;
  search?: string;
  min_price?: number;
  max_price?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  dateFrom?: string;
  dateTo?: string;
  // Advanced filters
  storage?: string;
  ram?: string;
  colors?: string;
  screen_size?: string;
  processor?: string;
  battery?: string;
  camera?: string;
  network?: string;
  os?: string;
  refresh_rate?: string;
  charging?: string;
  water_resistance?: string;
  in_stock?: boolean;
  rating?: number;
}