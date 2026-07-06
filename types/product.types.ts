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
  // Phone-specific specifications (extracted from specifications or stored separately)
  phone_specs?: PhoneSpecifications;
  category_slug?: string;
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
  // Advanced filters (comma-separated values)
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

// ============================================
// Phone-Specific Specifications
// ============================================

export interface PhoneSpecifications {
  // Display
  screenSize?: string;        // e.g., "6.7 inches"
  screenResolution?: string;  // e.g., "1080 x 2400 pixels"
  screenType?: string;        // e.g., "AMOLED", "LCD"
  refreshRate?: string;       // e.g., "120Hz"
  screenProtection?: string;  // e.g., "Gorilla Glass Victus"
  
  // Processor
  processor?: string;         // e.g., "Snapdragon 8 Gen 3"
  processorSpeed?: string;    // e.g., "3.3 GHz"
  processorCores?: string;    // e.g., "8-core"
  processorManufacturer?: string; // e.g., "Qualcomm", "MediaTek", "Apple"
  
  // Memory
  ram?: string;               // e.g., "8GB", "12GB"
  storage?: string;           // e.g., "128GB", "256GB"
  expandableStorage?: string; // e.g., "Up to 1TB"
  storageType?: string;       // e.g., "UFS 3.1", "NVMe"
  
  // Camera
  rearCamera?: string;        // e.g., "50MP + 12MP + 8MP"
  rearCameraDetails?: {
    main?: string;
    ultraWide?: string;
    telephoto?: string;
    macro?: string;
    depth?: string;
  };
  frontCamera?: string;       // e.g., "32MP"
  videoRecording?: string;    // e.g., "8K@24fps"
  cameraFeatures?: string[];  // e.g., ["OIS", "Night Mode", "AI Scene Detection"]
  
  // Battery
  batteryCapacity?: string;   // e.g., "5000mAh"
  chargingSpeed?: string;     // e.g., "45W Fast Charging"
  wirelessCharging?: boolean;
  reverseCharging?: boolean;
  batteryType?: string;       // e.g., "Li-Po", "Li-Ion"
  fastCharging?: string;      // e.g., "USB Power Delivery 3.0"
  
  // Connectivity
  network?: string;           // e.g., "5G", "4G"
  simSlots?: string;          // e.g., "Dual SIM"
  bluetooth?: string;         // e.g., "Bluetooth 5.3"
  wifi?: string;              // e.g., "Wi-Fi 6E"
  nfc?: boolean;
  usb?: string;               // e.g., "USB-C 3.2"
  gps?: string;               // e.g., "GPS, GLONASS, Galileo"
  
  // Physical
  weight?: string;            // e.g., "196g"
  dimensions?: string;        // e.g., "155.6 x 73.1 x 8.7 mm"
  buildMaterial?: string;     // e.g., "Aluminum frame, Glass back"
  
  // Other
  operatingSystem?: string;   // e.g., "Android 14"
  colors?: string[];          // e.g., ["Black", "White", "Blue"]
  waterResistance?: string;   // e.g., "IP68"
  fingerprintSensor?: string; // e.g., "Under-display"
  faceUnlock?: boolean;
  audioJack?: boolean;
  speakers?: string;          // e.g., "Stereo speakers"
  
  // Special features
  specialFeatures?: string[]; // e.g., ["AI Camera", "Gaming Mode"]
  
  // Sensors
  sensors?: string[];         // e.g., ["Accelerometer", "Gyroscope", "Proximity"]
  
  // Launch
  launchDate?: string;
  priceAtLaunch?: string;
}

// ============================================
// Filter System Types
// ============================================

export interface SortOption {
  value: string;
  label: string;
}

export interface FilterOptions {
  brands: Brand[];
  categories: Category[];
  minPrice: number;
  maxPrice: number;
  
  // Phone-specific filters
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
  
  // General filters
  ratings: number[];
  availability: string[];
  sortOptions: SortOption[];
}

export interface AppliedFilters {
  // Basic filters
  brand_id?: string;
  category_id?: string;
  search?: string;
  minPrice: number;
  maxPrice: number;
  
  // Phone-specific filters
  storage: string[];
  ram: string[];
  colors: string[];
  screenSize: string[];
  processor: string[];
  batteryCapacity: string[];
  camera: string[];
  network: string[];
  os: string[];
  refreshRate: string[];
  chargingSpeed: string[];
  waterResistance: string[];
  
  // Other filters
  rating?: number;
  inStock?: boolean;
  featured?: boolean;
  
  // Sorting & Pagination
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
  page: number;
  limit?: number;
}

// ============================================
// Category Types
// ============================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  image: string | null;
  image_public_id: string | null;
  seo: SEOData;
  status: 'publish' | 'hide';
  level: number;
  path: string[];
  created_at: string;
  updated_at: string;
  // Joined fields
  parent_name?: string;
  child_count?: number;
  children?: Category[];
}

// ============================================
// Filter Request/Response Types
// ============================================

export interface FilteredProductsRequest {
  // Basic filters
  brand_id?: string;
  category_id?: string;
  search?: string;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  rating?: number;
  
  // Phone-specific filters (comma-separated for multiple values)
  storage?: string;        // e.g., "128GB,256GB"
  ram?: string;            // e.g., "8GB,12GB"
  colors?: string;         // e.g., "Black,Blue"
  screen_size?: string;    // e.g., "6.7 inches,6.5 inches"
  processor?: string;      // e.g., "Snapdragon 8 Gen 3"
  battery?: string;        // e.g., "5000mAh,6000mAh"
  camera?: string;         // e.g., "50MP,108MP"
  network?: string;        // e.g., "5G,4G"
  os?: string;             // e.g., "Android 14"
  refresh_rate?: string;   // e.g., "120Hz,90Hz"
  charging?: string;       // e.g., "45W,65W"
  water_resistance?: string; // e.g., "IP68,IP67"
  
  // Pagination & Sorting
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface FilteredProductsResponse {
  success: boolean;
  products: Product[];
  pagination: PaginationData;
  appliedFilters: AppliedFilters;
  availableFilters: FilterOptions;
}

// ============================================
// Breadcrumb Types
// ============================================

export interface Breadcrumb {
  label: string;
  href: string;
  isActive?: boolean;
}

// ============================================
// Review Types
// ============================================

export interface ProductReview {
  id: string;
  product_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  rating: number;
  title: string;
  content: string;
  pros?: string[];
  cons?: string[];
  verified_purchase: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
  // Joined fields
  product_name?: string;
  product_image?: string;
}

export interface ProductReviewsResponse {
  success: boolean;
  reviews: ProductReview[];
  pagination: PaginationData;
  summary: {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: {
      1: number;
      2: number;
      3: number;
      4: number;
      5: number;
    };
  };
}

// ============================================
// Wishlist Types
// ============================================

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  product: Product;
  created_at: string;
}

export interface WishlistResponse {
  success: boolean;
  items: WishlistItem[];
  total: number;
}

// ============================================
// Compare Types (FIXED)
// ============================================

// Option 1: Use Omit to exclude conflicting properties
export interface CompareProduct extends Omit<Product, 'specifications' | 'variants' | 'variant_options'> {
  // Use a different property name for comparison specs
  comparison_specs: {
    [key: string]: string;
  };
  // Keep original specifications as optional for reference
  original_specifications?: Specification[];
}

// Option 2: Alternative - Separate interface for comparison data
export interface CompareProductData {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  description: string | null;
  short_description: string | null;
  base_price: number;
  sale_price: number | null;
  cost_price: number | null;
  main_image: string | null;
  gallery_images: string[];
  brand_name?: string;
  brand_logo?: string;
  category_name?: string;
  phone_specs?: PhoneSpecifications;
  // Comparison-specific data
  comparison_specs: {
    [key: string]: string;
  };
  rating?: number;
  review_count?: number;
}

// For the comparison table
export interface CompareGroup {
  category: string;
  products: {
    productId: string;
    value: string | number | boolean | null;
  }[];
}

// Comparison table structure
export interface ComparisonTable {
  headers: string[];
  rows: ComparisonRow[];
}

export interface ComparisonRow {
  label: string;
  values: (string | number | boolean | null)[];
}

// Comparison item for UI
export interface CompareItem {
  product: Product;
  specs: Record<string, string>;
  selected: boolean;
}

// ============================================
// Recently Viewed Types
// ============================================

export interface RecentlyViewedProduct extends Product {
  viewed_at: string;
}

// ============================================
// Search Types
// ============================================

export interface SearchSuggestion {
  type: 'product' | 'category' | 'brand';
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  price?: number;
}

export interface SearchResponse {
  success: boolean;
  products: Product[];
  categories: Category[];
  brands: Brand[];
  suggestions: SearchSuggestion[];
  pagination: PaginationData;
  query: string;
}

// ============================================
// Analytics Types
// ============================================

export interface ProductAnalytics {
  product_id: string;
  views: number;
  unique_views: number;
  add_to_cart_count: number;
  purchase_count: number;
  conversion_rate: number;
  average_time_on_page: number;
  bounce_rate: number;
  date: string;
}

// ============================================
// Import/Export Types
// ============================================

export interface ProductImportRow {
  name: string;
  sku: string;
  base_price: number;
  sale_price?: number;
  stock_quantity: number;
  brand_name?: string;
  category_name?: string;
  description?: string;
  short_description?: string;
  specifications?: string; // JSON string
  images?: string; // Comma-separated URLs
  status?: 'draft' | 'active' | 'inactive';
  // Phone-specific
  phone_specs?: string; // JSON string
}

export interface ProductExportOptions {
  format: 'csv' | 'json' | 'xlsx';
  filters: ProductFilters;
  includeVariants?: boolean;
  includePhoneSpecs?: boolean;
  fields?: string[];
}

// ============================================
// Bulk Operations Types
// ============================================

export interface BulkOperationRequest {
  action: 'delete' | 'update_status' | 'update_price' | 'update_stock';
  productIds: string[];
  data: any;
}

export interface BulkOperationResponse {
  success: boolean;
  processed: number;
  failed: number;
  errors?: {
    productId: string;
    error: string;
  }[];
}

// ============================================
// Filter UI State Types
// ============================================

export interface FilterSection {
  id: string;
  title: string;
  icon?: string;
  type: 'checkbox' | 'radio' | 'range' | 'color' | 'rating';
  options?: FilterOption[];
  range?: {
    min: number;
    max: number;
    step?: number;
  };
  isOpen: boolean;
}

export interface FilterOption {
  id: string;
  label: string;
  value: string;
  count?: number;
  color?: string;
  selected: boolean;
}

export interface FilterState {
  sections: FilterSection[];
  appliedFilters: AppliedFilters;
  totalResults: number;
  isDirty: boolean;
}

// ============================================
// Product Sorting Types
// ============================================

export interface SortOptionExtended {
  value: string;
  label: string;
  field: string;
  order: 'ASC' | 'DESC';
  default?: boolean;
}

// ============================================
// Product Tag Types
// ============================================

export interface ProductTag {
  id: string;
  name: string;
  slug: string;
  type: 'feature' | 'badge' | 'category' | 'custom';
  color?: string;
  icon?: string;
}

// ============================================
// Product Question & Answer Types
// ============================================

export interface ProductQuestion {
  id: string;
  product_id: string;
  user_id: string;
  user_name: string;
  question: string;
  answers: ProductAnswer[];
  helpful_count: number;
  created_at: string;
  updated_at: string;
}

export interface ProductAnswer {
  id: string;
  question_id: string;
  user_id: string;
  user_name: string;
  answer: string;
  is_verified_purchase: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
}

// ============================================
// Product Stock Alert Types
// ============================================

export interface StockAlert {
  id: string;
  product_id: string;
  user_id: string;
  email: string;
  variant_id?: string;
  status: 'pending' | 'sent' | 'cancelled';
  created_at: string;
  sent_at?: string;
}

// ============================================
// Product Price History Types
// ============================================

export interface PriceHistory {
  id: string;
  product_id: string;
  price: number;
  sale_price: number | null;
  recorded_at: string;
}

// ============================================
// Product Shipping Types
// ============================================

export interface ProductShipping {
  product_id: string;
  weight: number | null;
  weight_unit: string;
  dimensions: Dimensions;
  shipping_class?: string;
  free_shipping?: boolean;
  shipping_cost?: number;
  estimated_delivery?: string;
}

// ============================================
// Product Bundle Types
// ============================================

export interface ProductBundle {
  id: string;
  name: string;
  description: string | null;
  products: BundleProduct[];
  discount_percentage: number;
  total_price: number;
  bundle_price: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface BundleProduct {
  product_id: string;
  product: Product;
  quantity: number;
  variant_id?: string;
}

// ============================================
// Product Filter Presets
// ============================================

export interface FilterPreset {
  id: string;
  name: string;
  description?: string;
  filters: AppliedFilters;
  is_default?: boolean;
  user_id?: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// Product Recommendation Types
// ============================================

export interface ProductRecommendation {
  product: Product;
  score: number;
  reason: string;
  recommendation_type: 'similar' | 'frequently_bought' | 'trending' | 'personalized';
}

export interface ProductRecommendationsResponse {
  success: boolean;
  recommendations: ProductRecommendation[];
  total: number;
}