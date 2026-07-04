// utils/categoryMapping.ts
export interface CategoryMapping {
  id: string;
  name: string;
  slug: string;
  description: string;
  keywords: string[];
  icon?: string;
}

export const categoryMapping: Record<string, CategoryMapping> = {
  iphone: {
    id: 'iphone-category-id', // Replace with actual category ID from your database
    name: 'iPhone',
    slug: 'iphone',
    description: 'Discover the latest iPhone models with cutting-edge technology, powerful cameras, and seamless iOS experience.',
    keywords: ['apple', 'iphone', 'ios', 'smartphone', 'mobile']
  },
  android: {
    id: 'android-category-id', // Replace with actual category ID
    name: 'Android',
    slug: 'android',
    description: 'Explore premium Android smartphones from top brands like Samsung, Google, OnePlus, and Xiaomi.',
    keywords: ['android', 'samsung', 'google', 'oneplus', 'xiaomi', 'smartphone']
  },
  laptops: {
    id: 'laptops-category-id', // Replace with actual category ID
    name: 'Laptops',
    slug: 'laptops',
    description: 'High-performance laptops for work, gaming, and everyday use from leading manufacturers.',
    keywords: ['laptop', 'notebook', 'gaming', 'ultrabook', 'macbook']
  },
  accessories: {
    id: 'accessories-category-id', // Replace with actual category ID
    name: 'Accessories',
    slug: 'accessories',
    description: 'Essential gadgets and accessories including chargers, cases, screen protectors, and more.',
    keywords: ['accessories', 'charger', 'case', 'screen protector', 'cable']
  },
  headphones: {
    id: 'headphones-category-id', // Replace with actual category ID
    name: 'Headphones',
    slug: 'headphones',
    description: 'Premium audio experience with top-quality headphones, earphones, and wireless earbuds.',
    keywords: ['headphones', 'earphones', 'audio', 'wireless', 'earbuds']
  },
  handsets: {
    id: 'handsets-category-id', // Replace with actual category ID
    name: 'Handsets',
    slug: 'handsets',
    description: 'Wide range of mobile handsets including feature phones and basic smartphones.',
    keywords: ['handset', 'mobile', 'phone', 'cellphone', 'feature phone']
  },
  gaming: {
    id: 'gaming-category-id', // Replace with actual category ID
    name: 'Gaming Console',
    slug: 'gaming',
    description: 'Next-gen gaming consoles, accessories, and games for PlayStation, Xbox, and Nintendo.',
    keywords: ['gaming', 'console', 'playstation', 'xbox', 'nintendo', 'ps5']
  }
};

export const getCategoryBySlug = (slug: string): CategoryMapping | null => {
  return categoryMapping[slug] || null;
};

export const getAllCategories = (): CategoryMapping[] => {
  return Object.values(categoryMapping);
};