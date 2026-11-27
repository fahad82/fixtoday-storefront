"use client";

import Link from 'next/link';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

export const inputClass =
  'w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800';

/** Where to go after signing in: only paths on this site. */
export function safeNext(next: string | null): string {
  return next && next.startsWith('/') && !next.startsWith('//') ? next : '/account';
}

export default function AuthCard({ title, subtitle, children, footer }: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-[70vh] bg-gray-50 flex items-start justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600 mt-1 mb-6">{subtitle}</p>
          {children}
          <div className="mt-6 text-sm text-gray-600 text-center">{footer}</div>
          <p className="mt-4 text-xs text-gray-400 text-center">
            By continuing you agree to our <Link href="/privacy-policy" className="underline">privacy policy</Link>.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
