"use client";

import { Suspense } from 'react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import AccountDashboard from './AccountDashboard';

export default function AccountPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <Suspense fallback={<div className="py-24 text-center text-gray-500">Loading…</div>}>
          <AccountDashboard />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
