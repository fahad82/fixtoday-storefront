"use client";

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaExchangeAlt } from 'react-icons/fa';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { PAYOUT_LABELS, TradeIn, pounds, tradeInErrorMessage, tradeInService } from '@/services/tradeInService';

const inputClass =
  'w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-800 font-mono uppercase';

function Tracker() {
  const params = useSearchParams();
  const initial = { id: params.get('id') || '', code: params.get('code') || '' };
  return <TrackerForm key={`${initial.id}|${initial.code}`} initial={initial} />;
}

function TrackerForm({ initial }: { initial: { id: string; code: string } }) {
  const [number, setNumber] = useState(initial.id);
  const [code, setCode] = useState(initial.code);
  const [t, setT] = useState<TradeIn | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const lookup = { trade_in_number: number.trim(), tracking_code: code.trim() };

  // Opened from a link with both values: look it up straight away.
  useEffect(() => {
    if (!initial.id || !initial.code) return;
    tradeInService.track({ trade_in_number: initial.id, tracking_code: initial.code })
      .then(setT)
      .catch((err) => setError(tradeInErrorMessage(err)));
  }, [initial.id, initial.code]);

  const run = async (fn: () => Promise<TradeIn>) => {
    setBusy(true);
    setError(null);
    try {
      setT(await fn());
    } catch (err) {
      setError(tradeInErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <form
        onSubmit={(e) => { e.preventDefault(); run(() => tradeInService.track(lookup)); }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 grid sm:grid-cols-[1fr_1fr_auto] gap-4 items-end"
      >
        <label className="block"><span className="block text-sm font-semibold text-gray-700 mb-2">Trade-in ID</span>
          <input className={inputClass} placeholder="FT-T-2611-0001" value={number} onChange={(e) => setNumber(e.target.value)} required minLength={6} />
        </label>
        <label className="block"><span className="block text-sm font-semibold text-gray-700 mb-2">Tracking code</span>
          <input className={inputClass} placeholder="ABCD-EFGH" value={code} onChange={(e) => setCode(e.target.value)} required minLength={8} />
        </label>
        <button disabled={busy} className="px-6 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 disabled:opacity-60">Track</button>
      </form>

      {error && <p role="alert" className="p-4 rounded-xl bg-red-50 text-red-700 border border-red-200">{error}</p>}

      {t && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-wrap justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Trade-in</p>
              <p className="text-2xl font-bold font-mono text-gray-900">{t.trade_in_number}</p>
              <p className="text-gray-700">{t.device.brand} {t.device.model} {t.device.storage} · condition {t.grade_label.toLowerCase()}</p>
            </div>
            <span className="self-start px-3 py-1 rounded-full text-sm font-semibold bg-violet-100 text-violet-800">{t.status_label}</span>
          </div>
          <dl className="p-6 grid sm:grid-cols-3 gap-4 text-sm">
            <div><dt className="text-gray-500">Quoted</dt><dd className="text-lg font-bold">{pounds(t.quoted_pence)}</dd></div>
            <div><dt className="text-gray-500">Our offer</dt><dd className="text-lg font-bold">{t.offered_pence == null ? 'After we check it' : pounds(t.offered_pence)}</dd></div>
            <div><dt className="text-gray-500">Paid by</dt><dd className="text-lg font-bold">{PAYOUT_LABELS[t.payout_method]}</dd></div>
          </dl>

          {t.can_respond && (
            <div className="mx-6 mb-6 rounded-xl bg-amber-50 border border-amber-200 p-4">
              <p className="font-semibold text-amber-900">We checked your device and can offer {pounds(t.offered_pence)}.</p>
              <p className="text-sm text-amber-800 mt-1">{[...t.timeline].reverse().find((e) => e.status === 'revised_offer')?.note}</p>
              <div className="mt-3 flex flex-wrap gap-3">
                <button disabled={busy} onClick={() => run(() => tradeInService.respond(lookup, 'accept'))} className="px-5 py-2.5 bg-green-600 text-white rounded-xl font-semibold">Accept {pounds(t.offered_pence)}</button>
                <button disabled={busy} onClick={() => run(() => tradeInService.respond(lookup, 'decline'))} className="px-5 py-2.5 border-2 border-gray-300 rounded-xl font-semibold text-gray-700">Decline and get it back</button>
              </div>
            </div>
          )}

          <ol className="px-6 pb-6 space-y-3">
            {t.timeline.map((e, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-violet-500 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">{e.status_label}</p>
                  {e.note && <p className="text-gray-600">{e.note}</p>}
                  <p className="text-xs text-gray-400">{new Date(e.at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                </div>
              </li>
            ))}
          </ol>

          {t.can_cancel && (
            <div className="px-6 pb-6">
              <button disabled={busy} onClick={() => run(() => tradeInService.respond(lookup, 'cancel'))} className="text-sm font-semibold text-red-600 hover:underline">
                Cancel this trade-in
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function TrackTradeInPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-br from-violet-600 to-indigo-700 text-white">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="flex items-center gap-3 text-violet-100 text-sm font-semibold uppercase tracking-wider"><FaExchangeAlt /> Trade-in</div>
            <h1 className="text-3xl md:text-4xl font-bold mt-2">Track your trade-in</h1>
          </div>
        </section>
        <Suspense fallback={<div className="py-16 text-center text-gray-500">Loading…</div>}>
          <Tracker />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
