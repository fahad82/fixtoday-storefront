// contexts/CartContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Product } from '@/types/product.types';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  sku?: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string | null;
  variantId?: string;
  variantName?: string;
}

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string | null;
}

interface CartContextType {
  cartItems: CartItem[];
  wishlistItems: WishlistItem[];
  addToCart: (product: Product | any, quantity?: number, variant?: any) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  getCartTotal: () => number;
  getCartCount: () => number;
  getWishlistCount: () => number;
}

// Create the context with a default value
const CartContext = createContext<CartContextType | undefined>(undefined);

// Export useCart as a named export
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

// Export CartProvider as a named export
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error loading cart:', e);
      }
    }
    if (savedWishlist) {
      try {
        setWishlistItems(JSON.parse(savedWishlist));
      } catch (e) {
        console.error('Error loading wishlist:', e);
      }
    }
  }, []);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Add to cart with improved price handling
  const addToCart = useCallback((product: Product | any, quantity: number = 1, variant?: any) => {
    // Handle both Product type and simple objects from wishlist
    // Priority: variant price > sale_price > price > base_price
    const price = variant?.price || 
                  product.sale_price || 
                  product.price || 
                  product.base_price || 
                  0;
    
    // Handle original price
    const originalPrice = variant?.sale_price ? variant.price :
                         product.sale_price ? product.base_price :
                         product.originalPrice ? product.originalPrice :
                         undefined;
    
    // Ensure price is a number
    const finalPrice = typeof price === 'number' ? price : parseFloat(price) || 0;
    const finalOriginalPrice = originalPrice ? (typeof originalPrice === 'number' ? originalPrice : parseFloat(originalPrice) || undefined) : undefined;
    
    // Get the best available image
    const image = variant?.image || product.main_image || product.image || null;
    
    // Create cart item with proper ID
    const itemId = variant ? `${product.id}-${variant.id}` : product.id;
    
    const newItem: CartItem = {
      id: itemId,
      productId: product.id,
      name: variant ? `${product.name} (${variant.name})` : product.name,
      slug: product.slug || '',
      sku: product.sku || variant?.sku || '', 
      price: finalPrice,
      originalPrice: finalOriginalPrice,
      quantity: quantity,
      image: image,
      variantId: variant?.id,
      variantName: variant?.name,
    };

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === newItem.id);
      if (existingItem) {
        // Update quantity of existing item
        return prevItems.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      // Add new item
      return [...prevItems, newItem];
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const addToWishlist = useCallback((product: Product) => {
    const price = product.sale_price || product.base_price || 0;
    const originalPrice = product.sale_price ? product.base_price : undefined;
    
    const newItem: WishlistItem = {
      id: product.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: typeof price === 'number' ? price : parseFloat(price) || 0,
      originalPrice: originalPrice ? (typeof originalPrice === 'number' ? originalPrice : parseFloat(originalPrice) || undefined) : undefined,
      image: product.main_image || null,
    };

    setWishlistItems(prev => {
      if (prev.some(item => item.productId === product.id)) {
        return prev;
      }
      return [...prev, newItem];
    });
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlistItems(prev => prev.filter(item => item.productId !== productId));
  }, []);

  const isInWishlist = useCallback((productId: string) => {
    return wishlistItems.some(item => item.productId === productId);
  }, [wishlistItems]);

  // Get cart total with proper number handling
  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => {
      const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
      const quantity = typeof item.quantity === 'number' ? item.quantity : parseInt(item.quantity) || 1;
      return total + (price * quantity);
    }, 0);
  }, [cartItems]);

  const getCartCount = useCallback(() => {
    return cartItems.reduce((count, item) => {
      const quantity = typeof item.quantity === 'number' ? item.quantity : parseInt(item.quantity) || 1;
      return count + quantity;
    }, 0);
  }, [cartItems]);

  const getWishlistCount = useCallback(() => {
    return wishlistItems.length;
  }, [wishlistItems]);

  const contextValue: CartContextType = {
    cartItems,
    wishlistItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    getCartTotal,
    getCartCount,
    getWishlistCount,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};