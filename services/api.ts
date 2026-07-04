const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = {
  // Products
  async getProducts(params?: any) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/products${query ? `?${query}` : ''}`);
    return res.json();
  },

  async getProductBySlug(slug: string) {
    const res = await fetch(`${API_BASE}/products/slug/${slug}`);
    return res.json();
  },

  // Brands
  async getBrands(params?: any) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/brands${query ? `?${query}` : ''}`);
    return res.json();
  },

  async getBrandBySlug(slug: string) {
    const res = await fetch(`${API_BASE}/brands/slug/${slug}`);
    return res.json();
  },

  async getFeaturedBrands(limit = 10) {
    const res = await fetch(`${API_BASE}/brands/featured?limit=${limit}`);
    return res.json();
  },

  // Categories
  async getCategories(params?: any) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/categories${query ? `?${query}` : ''}`);
    return res.json();
  },

  async getCategoryTree() {
    const res = await fetch(`${API_BASE}/categories/tree`);
    return res.json();
  },

  async getCategoryBySlug(slug: string) {
    const res = await fetch(`${API_BASE}/categories/slug/${slug}`);
    return res.json();
  },

  // Collections
  async getCollections(params?: any) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/collections${query ? `?${query}` : ''}`);
    return res.json();
  },

  async getCollectionBySlug(slug: string) {
    const res = await fetch(`${API_BASE}/collections/slug/${slug}`);
    return res.json();
  },

  async getFeaturedCollections(limit = 10) {
    const res = await fetch(`${API_BASE}/collections/featured?limit=${limit}`);
    return res.json();
  },

  // Filters
  async getFilterOptions() {
    const [brandsRes, categoriesRes, minMaxRes] = await Promise.all([
      fetch(`${API_BASE}/brands?status=active&limit=100`),
      fetch(`${API_BASE}/categories?status=publish&limit=100`),
      fetch(`${API_BASE}/products/stats`),
    ]);

    const brands = await brandsRes.json();
    const categories = await categoriesRes.json();
    const stats = await minMaxRes.json();

    // Extract unique storage and color options from products
    const productsRes = await fetch(`${API_BASE}/products?limit=500`);
    const products = await productsRes.json();

    const storageOptions = new Set<string>();
    const colors = new Set<string>();

    if (products.products) {
      products.products.forEach((product: any) => {
        if (product.specifications) {
          product.specifications.forEach((spec: any) => {
            if (spec.name === 'Storage' || spec.name === 'storage') {
              storageOptions.add(spec.value);
            }
            if (spec.name === 'Color' || spec.name === 'color') {
              colors.add(spec.value);
            }
          });
        }
      });
    }

    return {
      brands: brands.brands || [],
      categories: categories.categories || [],
      minPrice: stats.stats?.min_price || 0,
      maxPrice: stats.stats?.max_price || 1000000,
      storageOptions: Array.from(storageOptions),
      colors: Array.from(colors),
    };
  },
};