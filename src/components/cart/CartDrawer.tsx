// components/cart/CartDrawer.tsx

"use client"; 

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../../hooks/useCart';
import { FaTrash, FaTimes, FaMinus, FaPlus, FaShoppingCart } from 'react-icons/fa';
import { CartItem } from '../../types';

export const CartDrawer: React.FC = () => {
  const {
    cartItems,
    isOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    getTotalItems,
    getTotalPrice,
    clearCart,
  } = useCart();

  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') closeCart();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [closeCart]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  const handleQuantityChange = (item: CartItem, newQuantity: number): void => {
    if (newQuantity < 1) return;
    if (newQuantity > 10) return;
    updateQuantity(item.id, newQuantity, item.selectedOptions);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity duration-300 z-40 text-gray-600"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out translate-x-0"
        role="dialog"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="flex items-center space-x-2">
            <FaShoppingCart className="text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-700">Your Cart ({totalItems})</h2>
          </div>
          <div className="flex items-center space-x-2">
            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                className="text-sm text-red-500 hover:text-red-700 transition-colors"
              >
                Clear All
              </button>
            )}
            <button
              onClick={closeCart}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-red-500"
              aria-label="Close cart"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 max-h-[calc(100vh-200px)]">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="text-gray-300 text-6xl mb-4">🛒</div>
              <p className="text-xl font-semibold text-gray-600">Your cart is empty</p>
              <p className="text-gray-400 mt-2">Browse our products and add items you love!</p>
              <button
                onClick={closeCart}
                className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={`${item.id}-${JSON.stringify(item.selectedOptions)}`}
                  className="flex space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {/* Product Image */}
                  <div className="relative w-20 h-20 flex-shrink-0 bg-white rounded-lg overflow-hidden border border-gray-200">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-400 text-xs">No img</span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/product/${item.slug}`}
                      onClick={closeCart}
                      className="font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    {Object.keys(item.selectedOptions).length > 0 && (
                      <div className="text-sm text-gray-500 mt-1">
                        {Object.entries(item.selectedOptions).map(([key, value]) => (
                          <span key={key} className="mr-2">
                            {key}: {value}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-1 bg-white rounded-lg border border-gray-200">
                        <button
                          onClick={() => handleQuantityChange(item, item.quantity - 1)}
                          className="p-1.5 hover:bg-gray-100 rounded-l-lg transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <FaMinus className="text-xs" />
                        </button>
                        <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item, item.quantity + 1)}
                          className="p-1.5 hover:bg-gray-100 rounded-r-lg transition-colors"
                          aria-label="Increase quantity"
                        >
                          <FaPlus className="text-xs" />
                        </button>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-blue-600">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id, item.selectedOptions)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                          aria-label="Remove item"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-4 bg-white sticky bottom-0">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                <span className="font-bold">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-600">Calculated at checkout</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-blue-600">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Link
                href="/checkout"
                onClick={closeCart}
                className="block w-full py-3 bg-blue-600 text-white text-center rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Proceed to Checkout
              </Link>
              <button
                onClick={closeCart}
                className="block w-full py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;