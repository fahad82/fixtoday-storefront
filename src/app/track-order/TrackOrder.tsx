"use client";

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import OrderSummaryCard from '@/components/orders/OrderSummaryCard';
import { CustomerOrder, orderErrorMessage, orderService } from '@/services/orderService';

export default function TrackOrder() {
  const initial = useSearchParams().get('order') || '';
  // Remount when the link's order number arrives, so the field starts filled in.
  return <TrackOrderForm key={initial} initial={initial} />;
}

function TrackOrderForm({ initial }: { initial: string }) {
  const [orderNumber, setOrderNumber] = useState(initial);
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState<CustomerOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      setOrder(await orderService.lookup(orderNumber.trim(), email.trim()));
    } catch (err) {
      setOrder(null);
      setError(orderErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const input = 'w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900';
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <form onSubmit={submit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 grid sm:grid-cols-[1fr_1fr_auto] gap-4 items-end">
        <label className="block">
          <span className="block text-sm font-semibold text-gray-700 mb-2">Order number</span>
          <input className={`${input} font-mono uppercase`} placeholder="ORD-2611-00001" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} required minLength={4} />
        </label>
        <label className="block">
          <span className="block text-sm font-semibold text-gray-700 mb-2">Email</span>
          <input className={input} type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <button type="submit" disabled={loading} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-60">
          {loading ? 'Finding…' : 'Track'}
        </button>
      </form>
      {error && <p role="alert" className="p-4 rounded-xl bg-red-50 text-red-700 border border-red-200">{error}</p>}
      {order && <OrderSummaryCard order={order} />}
    </div>
  );
}
