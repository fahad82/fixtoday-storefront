// src/app/product/[slug]/ProductWrapper.tsx
"use client";

import React from 'react';
import Navbar from '@/components/common/Navbar';
import CartDrawer from '@/components/cart/CartDrawer';
import ProductDetailClient from './ProductDetailClient';
import { Product } from '@/types';

interface ProductWrapperProps {
  product: Product;
  relatedProducts?: Product[];
}

export default function ProductWrapper({ product, relatedProducts = [] }: ProductWrapperProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased">
      <Navbar />
      <ProductDetailClient initialProduct={product} relatedProducts={relatedProducts} />
      <CartDrawer />
    </div>
  );
}