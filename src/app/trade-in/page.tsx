"use client";

import { Suspense } from 'react';
import { FaExchangeAlt } from 'react-icons/fa';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import TradeInWizard from './TradeInWizard';

export default function TradeInPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-br from-violet-600 to-indigo-700 text-white">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="flex items-center gap-3 text-violet-100 text-sm font-semibold uppercase tracking-wider">
              <FaExchangeAlt /> Sell your device
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mt-2">Get an instant price for your old phone</h1>
            <p className="mt-2 text-violet-100 max-w-2xl">
              Answer four quick questions, choose how you want to be paid, then drop it in or post it to us.
              Take it as shop credit and get 10% more.
            </p>
          </div>
        </section>
        <Suspense fallback={<div className="py-16 text-center text-gray-500">Loading…</div>}>
          <TradeInWizard />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
