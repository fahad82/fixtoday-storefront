"use client";

import { Suspense } from 'react';
import { FaClipboardCheck, FaRecycle, FaShieldAlt, FaUndo } from 'react-icons/fa';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import PreOwnedList from './PreOwnedList';

const PROMISES = [
  { icon: FaClipboardCheck, title: 'Tested by technicians', text: 'Every device is checked, cleaned and data wiped.' },
  { icon: FaShieldAlt, title: 'Warranty included', text: 'Refurbished and used devices come with a warranty.' },
  { icon: FaUndo, title: '14-day returns', text: 'Change your mind? Send it back within 14 days.' },
];

export default function RefurbishedPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex items-center gap-3 text-emerald-100 text-sm font-semibold uppercase tracking-wider">
              <FaRecycle /> Refurbished &amp; used
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mt-2">Quality checked, for less</h1>
            <p className="mt-2 text-emerald-50 max-w-2xl">
              Phones, tablets and laptops graded honestly, tested by our repair team, and covered by our warranty.
            </p>
            <div className="mt-8 grid sm:grid-cols-3 gap-4">
              {PROMISES.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex gap-3 rounded-xl bg-white/10 p-4">
                  <Icon className="w-5 h-5 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold">{title}</p>
                    <p className="text-sm text-emerald-50">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <Suspense fallback={<div className="py-16 text-center text-gray-500">Loading…</div>}>
          <PreOwnedList />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
