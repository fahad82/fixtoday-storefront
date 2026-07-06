// components/CartDrawer.tsx
'use client';

import React, { useMemo, useEffect } from 'react';
import Link from 'next/link';
import { 
  FaTimes, 
  FaTrash, 
  FaPlus, 
  FaMinus, 
  FaShoppingBag,
  FaCreditCard,
  FaArrowRight,
  FaGift,
  FaShieldAlt,
  FaTruck
} from 'react-icons/fa';
import { useCart } from '@/contexts/CartContext';
import CustomImage from './CustomImage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();

  const formatPrice = (price: number | undefined | null): string => {
    if (price === undefined || price === null || isNaN(price)) return '0.00';
    return Number(price).toFixed(2);
  };

  // Use useMemo to recalculate totals when cartItems changes
  const subtotal = useMemo(() => getCartTotal(), [cartItems, getCartTotal]);
  const cartCount = useMemo(() => getCartCount(), [cartItems, getCartCount]);

  const shipping = subtotal > 50 ? 0 : 4.99;
  const tax = subtotal * 0.2;
  const total = subtotal + shipping + tax;
  const freeShippingProgress = Math.min((subtotal / 50) * 100, 100);
  const remainingForFreeShipping = 50 - subtotal;

  // Debug logging - remove in production
  useEffect(() => {
    console.log('🛒 Cart Items:', cartItems);
    console.log('💰 Subtotal:', subtotal);
    console.log('📦 Cart Count:', cartCount);
  }, [cartItems, subtotal, cartCount]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-all duration-300"
        onClick={onClose}
      />
      
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-500 ease-out animate-slideInRight flex flex-col">
        
        {/* Header - Fixed */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-5 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <FaShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Your Cart</h2>
                <p className="text-gray-300 text-xs mt-0.5">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
            >
              <FaTimes className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Free Shipping Bar - Fixed if present */}
        {cartItems && cartItems.length > 0 && subtotal < 50 && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100 px-5 py-3 flex-shrink-0">
            <div className="flex items-center gap-2 mb-1.5">
              <FaTruck className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-xs font-medium text-amber-800">
                Add £{formatPrice(remainingForFreeShipping)} more for FREE shipping
              </span>
            </div>
            <div className="relative h-1.5 bg-amber-200 rounded-full overflow-hidden">
              <div 
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Items - Scrollable */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
          {!cartItems || cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                <FaShoppingBag className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Your cart is empty</h3>
              <p className="text-gray-500 text-sm mb-4">Add some items to get started</p>
              <Link
                href="/"
                onClick={onClose}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-lg font-semibold text-sm hover:bg-gray-800 transition-all hover:scale-105"
              >
                Start Shopping
                <FaArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            cartItems.map((item) => {
              const itemPrice = item.price != null ? Number(item.price) : 0;
              const itemOriginalPrice = item.originalPrice != null ? Number(item.originalPrice) : undefined;
              
              return (
                <div 
                  key={item.id} 
                  className="group bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                >
                  <div className="flex gap-3">
                    <Link href={`/product/${item.slug || '#'}`} onClick={onClose} className="flex-shrink-0">
                      <div className="relative w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden">
                        <CustomImage
                          src={item.image || null}
                          alt={item.name || 'Product'}
                          fill
                          className="p-1.5 group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link href={`/product/${item.slug || '#'}`} onClick={onClose}>
                        <h4 className="font-semibold text-gray-800 hover:text-gray-600 transition-colors line-clamp-2 text-sm">
                          {item.name || 'Product'}
                        </h4>
                      </Link>
                      
                      {item.variantName && (
                        <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                          <span className="inline-block w-1 h-1 bg-gray-400 rounded-full"></span>
                          {item.variantName}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between mt-2">
                        <div>
                          <span className="text-lg font-bold text-gray-900">
                            £{formatPrice(itemPrice)}
                          </span>
                          {itemOriginalPrice && itemOriginalPrice > itemPrice && (
                            <span className="text-xs text-gray-400 line-through ml-1">
                              £{formatPrice(itemOriginalPrice)}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
                            <button
                              onClick={() => {
                                const newQuantity = (item.quantity || 1) - 1;
                                updateQuantity(item.id, newQuantity);
                              }}
                              disabled={!item.quantity || item.quantity <= 1}
                              className="w-7 h-7 flex items-center justify-center bg-white rounded-md hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <FaMinus className="w-2.5 h-2.5 text-gray-600" />
                            </button>
                            <span className="w-7 text-center text-sm font-semibold text-gray-800">
                              {item.quantity || 1}
                            </span>
                            <button
                              onClick={() => {
                                const newQuantity = (item.quantity || 1) + 1;
                                updateQuantity(item.id, newQuantity);
                              }}
                              className="w-7 h-7 flex items-center justify-center bg-white rounded-md hover:bg-gray-50 transition-colors shadow-sm"
                            >
                              <FaPlus className="w-2.5 h-2.5 text-gray-600" />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="w-7 h-7 flex items-center justify-center bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200"
                            title="Remove item"
                          >
                            <FaTrash className="w-3 h-3 text-red-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer - Fixed at bottom */}
        {cartItems && cartItems.length > 0 && (
          <div className="border-t border-gray-200 bg-white shadow-lg rounded-t-2xl flex-shrink-0">
            {/* Order Summary */}
            <div className="px-5 pt-4 pb-2 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-gray-800">£{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold text-gray-800">
                  {shipping === 0 ? (
                    <span className="text-emerald-600">Free</span>
                  ) : (
                    `£${formatPrice(shipping)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (VAT)</span>
                <span className="font-semibold text-gray-800">£{formatPrice(tax)}</span>
              </div>
              
              {/* Promo Code */}
              <div className="flex items-center gap-1 text-xs text-emerald-600">
                <FaGift className="w-3 h-3" />
                <span>Free shipping on orders over £50</span>
              </div>
            </div>
            
            <div className="h-px bg-gray-100 mx-5"></div>
            
            {/* Total */}
            <div className="px-5 py-3 flex justify-between items-center">
              <div>
                <span className="text-sm font-medium text-gray-900">Total</span>
                <p className="text-xs text-gray-500">Including VAT</p>
              </div>
              <span className="text-2xl font-bold text-gray-900">
                £{formatPrice(total)}
              </span>
            </div>

            {/* Checkout Button */}
            <div className="px-5 pb-4">
              <Link
                href="/checkout"
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-gray-900 text-white rounded-xl font-semibold text-sm hover:bg-gray-800 transition-all hover:shadow-xl active:scale-[0.98] group"
              >
                <FaCreditCard className="w-4 h-4" />
                Proceed to Checkout
                <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              {/* Trust Badge */}
              <div className="flex items-center justify-center gap-2 mt-3 text-xs text-gray-500">
                <FaShieldAlt className="w-3 h-3 text-emerald-500" />
                <span>Secure checkout with encryption</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }
        
        .overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
      `}</style>
    </>
  );
};

export default CartDrawer;