"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FaCheck, FaCheckCircle, FaExclamationTriangle, FaSearch, FaShieldAlt, FaTimesCircle, FaTools } from 'react-icons/fa';
import {
  Lookup, RepairStatus, TrackedRepair, formatDate, formatMoney, repairErrorMessage, repairService,
} from '../../../services/repairService';

const STEPS: { label: string; statuses: RepairStatus[] }[] = [
  { label: 'Booked', statuses: ['booked'] },
  { label: 'Received', statuses: ['received'] },
  { label: 'Checking', statuses: ['diagnosing'] },
  { label: 'Quote', statuses: ['awaiting_approval', 'approved', 'declined'] },
  { label: 'Repairing', statuses: ['in_repair', 'waiting_parts', 'repaired', 'unrepairable'] },
  { label: 'Ready', statuses: ['ready_for_collection'] },
  { label: 'Collected', statuses: ['released'] },
];

// What the customer should know or do at each status.
const STATUS_HELP: Record<RepairStatus, string> = {
  booked: 'We are expecting your device. Bring it to the shop or post it to us with your repair ID.',
  received: 'Your device is with us and is waiting to be inspected.',
  diagnosing: 'A technician is inspecting your device to find the problem.',
  awaiting_approval: 'Your quote is ready. Please approve or decline it below so we can continue.',
  approved: 'Thanks for approving the quote. Your repair is queued.',
  declined: 'You declined the quote. Your device will be returned without repair.',
  in_repair: 'Your device is being repaired.',
  waiting_parts: 'We are waiting for parts to arrive. We will continue as soon as they are here.',
  repaired: 'The repair is done and your device is being tested.',
  unrepairable: 'Unfortunately we could not repair your device. It will be returned to you.',
  ready_for_collection: 'Your device is ready to collect. Bring your repair slip or repair ID.',
  released: 'Your device has been collected. Thank you for choosing us.',
  cancelled: 'This repair was cancelled.',
};

const inputClass =
  'w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800';

export default function TrackRepair() {
  const params = useSearchParams();
  const [repairNumber, setRepairNumber] = useState(params.get('id') || '');
  const [mode, setMode] = useState<'code' | 'phone'>('code');
  const [code, setCode] = useState(params.get('code') || '');
  const [last4, setLast4] = useState('');
  const [repair, setRepair] = useState<TrackedRepair | null>(null);
  // The tracking code that opened this repair; needed to approve or decline a quote.
  const [verifiedCode, setVerifiedCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookup = async (l: Lookup) => {
    setLoading(true);
    setError(null);
    try {
      const r = await repairService.track(l);
      setRepair(r);
      setVerifiedCode(l.tracking_code || null);
    } catch (err) {
      setRepair(null);
      setError(repairErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Opened from the QR code on the slip or the booking confirmation.
  const autoLooked = useRef(false);
  useEffect(() => {
    const id = params.get('id');
    const c = params.get('code');
    if (id && c && !autoLooked.current) {
      autoLooked.current = true;
      repairService
        .track({ repair_number: id, tracking_code: c })
        .then((r) => {
          setRepair(r);
          setVerifiedCode(c);
        })
        .catch((err) => setError(repairErrorMessage(err)));
    }
  }, [params]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = repairNumber.trim().toUpperCase();
    if (!id) return setError('Enter your repair ID, for example FT-R-2611-0001.');
    if (mode === 'code') {
      if (code.replace(/[^a-z0-9]/gi, '').length !== 8) return setError('The tracking code has 8 letters and numbers, for example K7QM-4XPZ.');
      lookup({ repair_number: id, tracking_code: code.trim() });
    } else {
      if (!/^\d{4}$/.test(last4)) return setError('Enter the last 4 digits of the phone number you gave us.');
      lookup({ repair_number: id, phone_last4: last4 });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <form onSubmit={submit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-sm font-semibold text-gray-700 mb-1.5">Repair ID</span>
            <input className={`${inputClass} font-mono uppercase`} value={repairNumber} onChange={(e) => setRepairNumber(e.target.value)} placeholder="FT-R-2611-0001" />
          </label>
          {mode === 'code' ? (
            <label className="block">
              <span className="block text-sm font-semibold text-gray-700 mb-1.5">Tracking code</span>
              <input className={`${inputClass} font-mono uppercase`} value={code} onChange={(e) => setCode(e.target.value)} placeholder="K7QM-4XPZ" autoComplete="off" />
            </label>
          ) : (
            <label className="block">
              <span className="block text-sm font-semibold text-gray-700 mb-1.5">Last 4 digits of your phone number</span>
              <input className={`${inputClass} font-mono`} value={last4} onChange={(e) => setLast4(e.target.value.replace(/\D/g, '').slice(0, 4))} inputMode="numeric" placeholder="0123" />
            </label>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button type="button" onClick={() => { setMode(mode === 'code' ? 'phone' : 'code'); setError(null); }} className="text-sm text-blue-600 hover:underline">
            {mode === 'code' ? "Don't have the tracking code? Use your phone number" : 'Use the tracking code from your slip instead'}
          </button>
          <button type="submit" disabled={loading} className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors">
            <FaSearch /> {loading ? 'Looking…' : 'Track repair'}
          </button>
        </div>
        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-sm px-4 py-3 flex items-start gap-2">
            <FaExclamationTriangle className="mt-0.5 shrink-0" /> {error}
          </div>
        )}
      </form>

      {repair && <RepairView repair={repair} trackingCode={verifiedCode} onUpdate={setRepair} />}

      {!repair && (
        <p className="text-center text-sm text-gray-500">
          Haven&apos;t booked yet? <Link href="/repairs/book" className="text-blue-600 hover:underline">Book a repair online</Link>.
        </p>
      )}
    </div>
  );
}

function RepairView({ repair: r, trackingCode, onUpdate }: { repair: TrackedRepair; trackingCode: string | null; onUpdate: (r: TrackedRepair) => void }) {
  const current = STEPS.findIndex((s) => s.statuses.includes(r.status));
  const device = [r.device.brand, r.device.model].filter(Boolean).join(' ') || r.device.type;
  const notes = r.timeline.filter((e) => e.type === 'note' && e.note);
  const statusEvents = r.timeline.filter((e) => e.status);
  const warrantyActive = r.warranty_expires_at && new Date(r.warranty_expires_at) > new Date();

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">Repair {r.repair_number}</div>
            <h2 className="text-2xl font-bold text-gray-900 mt-1">{r.status_label}</h2>
            <p className="text-gray-600 mt-1">{device}</p>
          </div>
          {r.expected_ready_at && !['ready_for_collection', 'released', 'cancelled'].includes(r.status) && (
            <div className="text-right">
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">Expected ready</div>
              <div className="font-semibold">{formatDate(r.expected_ready_at)}</div>
            </div>
          )}
        </div>

        {r.status !== 'cancelled' && (
          <ol className="mt-6 grid grid-cols-7 gap-1">
            {STEPS.map((s, i) => (
              <li key={s.label} className="text-center">
                <div className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i < current ? 'bg-blue-600 text-white' : i === current ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                  {i < current ? <FaCheck /> : i + 1}
                </div>
                <div className={`text-[11px] mt-1 ${i === current ? 'font-semibold text-blue-700' : 'text-gray-500'}`}>{s.label}</div>
              </li>
            ))}
          </ol>
        )}

        <p className="mt-6 rounded-xl bg-blue-50 text-blue-900 px-4 py-3 text-sm">{STATUS_HELP[r.status]}</p>
      </section>

      {r.can_respond_to_quote && <QuoteDecision repair={r} trackingCode={trackingCode} onUpdate={onUpdate} />}

      <div className="grid md:grid-cols-2 gap-6">
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-3">Repair details</h3>
          <dl className="space-y-2 text-sm">
            <Row k="Device" v={device} />
            <Row k="Problem reported" v={r.reported_fault} />
            {r.received_at && <Row k="Received" v={formatDate(r.received_at, true)} />}
            {r.quoted_cost_pence !== null ? <Row k="Quote" v={formatMoney(r.quoted_cost_pence)} /> : r.estimated_cost_pence !== null ? <Row k="Estimate" v={formatMoney(r.estimated_cost_pence)} /> : null}
            {r.paid_pence > 0 && <Row k="Paid so far" v={formatMoney(r.paid_pence)} />}
            {r.amount_due_pence > 0 && r.status !== 'released' && <Row k="Left to pay" v={formatMoney(Math.max(r.balance_pence, 0))} />}
          </dl>
          {r.released_at && (
            <div className={`mt-4 rounded-xl px-4 py-3 text-sm flex items-start gap-2 ${warrantyActive ? 'bg-emerald-50 text-emerald-900' : 'bg-gray-50 text-gray-700'}`}>
              <FaShieldAlt className="mt-0.5 shrink-0" />
              {r.warranty_expires_at ? (
                <span>
                  {r.warranty_days}-day warranty {warrantyActive ? 'until' : 'ended on'} <b>{formatDate(r.warranty_expires_at)}</b>. It covers the repaired fault and replaced parts.
                </span>
              ) : (
                <span>No warranty applies because the device was not repaired.</span>
              )}
            </div>
          )}
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-3">Progress</h3>
          <ol className="relative border-l border-gray-200 ml-2 space-y-4">
            {[...statusEvents].reverse().map((e, i) => (
              <li key={`${e.at}-${i}`} className="ml-4">
                <span className={`absolute -left-1.5 mt-1.5 w-3 h-3 rounded-full ${i === 0 ? 'bg-blue-600' : 'bg-gray-300'}`} />
                <div className="text-sm font-semibold text-gray-900">{e.status_label}</div>
                <div className="text-xs text-gray-500">{formatDate(e.at, true)}</div>
              </li>
            ))}
          </ol>
          {notes.length > 0 && (
            <div className="mt-5 pt-4 border-t border-gray-100 space-y-3">
              <h4 className="text-sm font-bold text-gray-900">Messages from us</h4>
              {[...notes].reverse().map((n, i) => (
                <div key={`${n.at}-${i}`} className="text-sm">
                  <p className="text-gray-800 whitespace-pre-wrap">{n.note}</p>
                  <p className="text-xs text-gray-500">{formatDate(n.at, true)}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-sm text-gray-700 flex flex-wrap items-center gap-x-6 gap-y-2">
        <span className="flex items-center gap-2 font-semibold text-gray-900"><FaTools /> Questions about this repair?</span>
        {r.shop.phone && <a href={`tel:${r.shop.phone}`} className="text-blue-600 hover:underline">{r.shop.phone}</a>}
        {r.shop.email && <a href={`mailto:${r.shop.email}?subject=${encodeURIComponent(`Repair ${r.repair_number}`)}`} className="text-blue-600 hover:underline">{r.shop.email}</a>}
        {r.shop.address && <span className="whitespace-pre-line">{r.shop.address}</span>}
      </section>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <dt className="text-gray-500">{k}</dt>
      <dd className="col-span-2 text-gray-900 whitespace-pre-wrap">{v}</dd>
    </div>
  );
}

function QuoteDecision({ repair: r, trackingCode, onUpdate }: { repair: TrackedRepair; trackingCode: string | null; onUpdate: (r: TrackedRepair) => void }) {
  const [code, setCode] = useState(trackingCode || '');
  const [message, setMessage] = useState('');
  const [confirming, setConfirming] = useState<'approve' | 'decline' | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const respond = async (decision: 'approve' | 'decline') => {
    setSaving(true);
    setError(null);
    try {
      onUpdate(await repairService.respondToQuote(decision, { repair_number: r.repair_number, tracking_code: code.trim(), ...(message.trim() && { message: message.trim() }) }));
    } catch (err) {
      setError(repairErrorMessage(err));
      setConfirming(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="bg-white rounded-2xl border-2 border-amber-300 shadow-sm p-6 space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="text-lg font-bold text-gray-900">Your quote</h3>
        <div className="text-3xl font-bold text-gray-900">{formatMoney(r.quoted_cost_pence)}</div>
      </div>
      <p className="text-sm text-gray-600">Price includes VAT. If you decline, we return your device unrepaired.</p>

      {!trackingCode && (
        <label className="block">
          <span className="block text-sm font-semibold text-gray-700 mb-1.5">Tracking code from your slip or booking</span>
          <input className={`${inputClass} font-mono uppercase md:w-64`} value={code} onChange={(e) => setCode(e.target.value)} placeholder="K7QM-4XPZ" autoComplete="off" />
          <span className="block text-xs text-gray-500 mt-1">For your security, answering a quote needs the tracking code.</span>
        </label>
      )}

      <label className="block">
        <span className="block text-sm font-semibold text-gray-700 mb-1.5">Message for us (optional)</span>
        <textarea className={inputClass} rows={2} value={message} onChange={(e) => setMessage(e.target.value)} maxLength={1000} />
      </label>

      {confirming ? (
        <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 space-y-3">
          <p className="text-sm font-semibold text-gray-900">
            {confirming === 'approve' ? `Approve the repair for ${formatMoney(r.quoted_cost_pence)}?` : 'Decline the quote and have your device returned unrepaired?'}
          </p>
          <div className="flex gap-3">
            <button onClick={() => respond(confirming)} disabled={saving} className={`px-5 py-2.5 rounded-xl text-white font-semibold disabled:opacity-60 ${confirming === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'}`}>
              {saving ? 'Sending…' : confirming === 'approve' ? 'Yes, approve' : 'Yes, decline'}
            </button>
            <button onClick={() => setConfirming(null)} disabled={saving} className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white font-semibold">Go back</button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => (code.replace(/[^a-z0-9]/gi, '').length === 8 ? setConfirming('approve') : setError('Enter your 8-character tracking code first.'))}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl"
          >
            <FaCheckCircle /> Approve quote
          </button>
          <button
            onClick={() => (code.replace(/[^a-z0-9]/gi, '').length === 8 ? setConfirming('decline') : setError('Enter your 8-character tracking code first.'))}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 font-semibold rounded-xl"
          >
            <FaTimesCircle /> Decline
          </button>
        </div>
      )}
      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-sm px-4 py-3">{error}</div>}
    </section>
  );
}
