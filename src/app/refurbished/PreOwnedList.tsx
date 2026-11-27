"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/products/ProductCard';
import { GRADE_LABELS } from '@/components/products/ConditionBadge';
import { productService } from '@/services/productService';
import type { Product } from '@/types';

const FILTERS = [
  { id: 'all', label: 'All', condition: 'refurbished,used' },
  { id: 'refurbished', label: 'Refurbished', condition: 'refurbished' },
  { id: 'used', label: 'Used', condition: 'used' },
];
const SORTS = [
  { id: 'newest', label: 'Newest', sortBy: 'created_at', sortOrder: 'DESC' as const },
  { id: 'price-asc', label: 'Price: low to high', sortBy: 'base_price', sortOrder: 'ASC' as const },
  { id: 'price-desc', label: 'Price: high to low', sortBy: 'base_price', sortOrder: 'DESC' as const },
];

export default function PreOwnedList() {
  const params = useSearchParams();
  const filter = FILTERS.find((f) => f.id === params.get('type')) || FILTERS[0];
  const sort = SORTS.find((s) => s.id === params.get('sort')) || SORTS[0];
  const grade = params.get('grade') || '';
  const key = `${filter.id}|${sort.id}`;
  const [result, setResult] = useState<{ key: string; products: Product[]; error: boolean } | null>(null);

  useEffect(() => {
    productService
      .getProducts({ condition: filter.condition, sortBy: sort.sortBy, sortOrder: sort.sortOrder, limit: 60 })
      .then((res) => setResult({ key, products: res.products || [], error: false }))
      .catch(() => setResult({ key, products: [], error: true }));
  }, [key, filter.condition, sort.sortBy, sort.sortOrder]);

  const loading = !result || result.key !== key;
  const products = (result?.products || []).filter((p) => !grade || p.condition_grade === grade);
  const href = (next: Record<string, string>) => {
    const q = new URLSearchParams({ type: filter.id, sort: sort.id, ...(grade && { grade }), ...next });
    if (!q.get('grade')) q.delete('grade');
    return `/refurbished?${q.toString()}`;
  };
  const pill = (active: boolean) =>
    `px-4 py-2 rounded-full text-sm font-semibold border ${active ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'}`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {FILTERS.map((f) => (
          <Link key={f.id} href={href({ type: f.id })} scroll={false} className={pill(f.id === filter.id)}>{f.label}</Link>
        ))}
        <span className="w-px h-6 bg-gray-200 mx-1" />
        <Link href={href({ grade: '' })} scroll={false} className={pill(!grade)}>Any grade</Link>
        {Object.entries(GRADE_LABELS).map(([id, g]) => (
          <Link key={id} href={href({ grade: id })} scroll={false} className={pill(grade === id)}>{g.label}</Link>
        ))}
        <label className="ml-auto text-sm text-gray-600 flex items-center gap-2">
          Sort
          <select
            className="border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-800"
            value={sort.id}
            onChange={(e) => { window.location.assign(href({ sort: e.target.value })); }}
          >
            {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </label>
      </div>

      {loading ? (
        <div className="py-16 text-center text-gray-500">Loading devices…</div>
      ) : result?.error ? (
        <div className="py-16 text-center text-gray-600">We could not load the devices. Please try again in a moment.</div>
      ) : products.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-700 font-semibold">Nothing in this selection right now.</p>
          <p className="text-gray-500 text-sm mt-1">New stock arrives every week. Want to sell your old device instead?</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{products.length} device{products.length === 1 ? '' : 's'}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </>
      )}
    </div>
  );
}
