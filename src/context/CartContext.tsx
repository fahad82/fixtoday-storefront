"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { CartItem, Product } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  isOpen: boolean;
  addToCart: (product: Product, quantity?: number, selectedOptions?: Record<string, string>) => void;
  removeFromCart: (id: string, selectedOptions?: Record<string, string>) => void;
  updateQuantity: (id: string, quantity: number, selectedOptions?: Record<string, string>) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }, [cartItems]);

  const addToCart = (product: Product, quantity: number = 1, selectedOptions: Record<string, string> = {}): void => {
    setCartItems((prevItems) => {
      const itemKey = `${product.id}-${JSON.stringify(selectedOptions)}`;
      const existingItemIndex = prevItems.findIndex(
        (item) => `${item.id}-${JSON.stringify(item.selectedOptions)}` === itemKey
      );

      const price = product.sale_price || product.base_price;

      if (existingItemIndex !== -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
        };
        return updatedItems;
      }

      return [
        ...prevItems,
        {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: price || 0,
          originalPrice: product.base_price || 0,
          image: product.main_image,
          quantity,
          selectedOptions,
          sku: product.sku,
          stock: product.stock_quantity || 0,
        },
      ];
    });

    setIsOpen(true);
  };

  const removeFromCart = (id: string, selectedOptions: Record<string, string> = {}): void => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => !(item.id === id && JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions))
      )
    );
  };

  const updateQuantity = (id: string, quantity: number, selectedOptions: Record<string, string> = {}): void => {
    if (quantity <= 0) {
      removeFromCart(id, selectedOptions);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = (): void => {
    setCartItems([]);
  };

  const getTotalItems = (): number => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = (): number => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const openCart = (): void => setIsOpen(true);
  const closeCart = (): void => setIsOpen(false);
  const toggleCart = (): void => setIsOpen((prev) => !prev);

  const value = useMemo(
    () => ({
      cartItems,
      isOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice,
      openCart,
      closeCart,
      toggleCart,
    }),
    [cartItems, isOpen]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};