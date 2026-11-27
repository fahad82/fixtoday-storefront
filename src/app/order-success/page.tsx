"use client";

import { Suspense } from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import OrderConfirmation from './OrderConfirmation';

export default function OrderSuccessPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <Suspense fallback={<div className="py-24 text-center text-gray-500">Loading your order…</div>}>
          <OrderConfirmation />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
