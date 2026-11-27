"use client";

import { Suspense } from 'react';
import { FaShippingFast } from 'react-icons/fa';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import TrackOrder from './TrackOrder';

export default function TrackOrderPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="flex items-center gap-3 text-blue-100 text-sm font-semibold uppercase tracking-wider">
              <FaShippingFast /> Orders
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mt-2">Track your order</h1>
            <p className="mt-2 text-blue-100 max-w-2xl">Enter your order number and the email you used at checkout.</p>
          </div>
        </section>
        <Suspense fallback={<div className="py-16 text-center text-gray-500">Loading…</div>}>
          <TrackOrder />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
