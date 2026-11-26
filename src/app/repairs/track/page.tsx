"use client";

import { Suspense } from 'react';
import { FaTools } from 'react-icons/fa';
import Navbar from '../../../components/common/Navbar';
import Footer from '../../../components/common/Footer';
import TrackRepair from './TrackRepair';

export default function TrackRepairPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="flex items-center gap-3 text-blue-100 text-sm font-semibold uppercase tracking-wider">
              <FaTools /> Repairs
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mt-2">Track your repair</h1>
            <p className="mt-2 text-blue-100 max-w-2xl">
              Enter the repair ID and tracking code from your slip or booking confirmation, or scan the QR code on your slip.
            </p>
          </div>
        </section>
        <Suspense fallback={<div className="py-16 text-center text-gray-500">Loading…</div>}>
          <TrackRepair />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
