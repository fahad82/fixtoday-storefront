"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { FaCheckCircle, FaSearch } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import {
  Answers, PAYOUT_LABELS, Payout, Quote, TradeIn, TradeInModel, pounds, tradeInErrorMessage, tradeInService,
} from '@/services/tradeInService';

const inputClass =
  'w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-gray-800';

const QUESTIONS: { key: keyof Answers; label: string; options: { value: Answers[keyof Answers]; label: string }[] }[] = [
  { key: 'powers_on', label: 'Does it turn on and work normally?', options: [{ value: true, label: 'Yes' }, { value: false, label: 'No' }] },
  {
    key: 'screen', label: 'What is the screen like?',
    options: [{ value: 'perfect', label: 'No scratches' }, { value: 'scratched', label: 'Light scratches' }, { value: 'cracked', label: 'Cracked' }],
  },
  {
    key: 'body', label: 'What is the body like?',
    options: [{ value: 'perfect', label: 'Like new' }, { value: 'worn', label: 'Scuffs or scratches' }, { value: 'damaged', label: 'Dents or cracks' }],
  },
  { key: 'battery_ok', label: 'Does the battery last a full day?', options: [{ value: true, label: 'Yes' }, { value: false, label: 'No' }] },
];

type Partial4 = Partial<Answers>;
const complete = (a: Partial4): a is Answers => QUESTIONS.every((q) => a[q.key] !== undefined);

export default function TradeInWizard() {
  const { user } = useAuth();
  const [models, setModels] = useState<TradeInModel[] | null>(null);
  const [search, setSearch] = useState('');
  const [model, setModel] = useState<TradeInModel | null>(null);
  const [answers, setAnswers] = useState<Partial4>({});
  const [payout, setPayout] = useState<Payout>('bank');
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoting, setQuoting] = useState(false);
  const [details, setDetails] = useState({ name: '', email: '', phone: '', imei: '', delivery_method: 'drop_off' as 'drop_off' | 'post', website: '' });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<TradeIn | null>(null);

  useEffect(() => {
    tradeInService.models().then(setModels).catch(() => setModels([]));
  }, []);

  const matches = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (models || []).filter((m) => !q || `${m.brand} ${m.model} ${m.storage}`.toLowerCase().includes(q)).slice(0, 30);
  }, [models, search]);

  const getQuote = (m: TradeInModel, a: Partial4, p: Payout) => {
    setQuote(null);
    if (!complete(a)) return;
    setQuoting(true);
    tradeInService.quote(m.id, a, p)
      .then(setQuote)
      .catch((err) => setError(tradeInErrorMessage(err)))
      .finally(() => setQuoting(false));
  };

  const answer = (key: keyof Answers, value: Answers[keyof Answers]) => {
    const next = { ...answers, [key]: value };
    setAnswers(next);
    if (model) getQuote(model, next, payout);
  };

  const choosePayout = (p: Payout) => {
    setPayout(p);
    if (model) getQuote(model, answers, p);
  };

  const startDetails = () => {
    // Fill in from the account, without overwriting anything typed.
    if (user) setDetails((d) => ({ ...d, name: d.name || user.name, email: d.email || user.email, phone: d.phone || user.phone || '' }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!model || !complete(answers)) return;
    setBusy(true);
    setError(null);
    try {
      setDone(await tradeInService.submit({
        model_id: model.id,
        answers,
        payout_method: payout,
        delivery_method: details.delivery_method,
        ...(details.imei.trim() && { imei: details.imei.trim() }),
        customer: { name: details.name.trim(), email: details.email.trim(), phone: details.phone.trim() },
        website: details.website,
      }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(tradeInErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  if (done) return <Confirmation t={done} />;

  const card = 'bg-white rounded-2xl shadow-sm border border-gray-100 p-6';
  const choice = (active: boolean) =>
    `px-4 py-2.5 rounded-xl border text-sm font-semibold ${active ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-gray-700 border-gray-200 hover:border-violet-400'}`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      {/* 1. Device */}
      <section className={card}>
        <h2 className="text-lg font-bold text-gray-900">1. Which device?</h2>
        {model ? (
          <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-violet-50 border border-violet-100 p-4">
            <div>
              <p className="font-semibold text-gray-900">{model.brand} {model.model} {model.storage}</p>
              <p className="text-sm text-gray-600">We pay up to {pounds(model.max_offer_pence)}</p>
            </div>
            <button type="button" className="text-sm font-semibold text-violet-700" onClick={() => { setModel(null); setQuote(null); }}>Change</button>
          </div>
        ) : (
          <>
            <div className="relative mt-3">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input className={`${inputClass} pl-11`} placeholder="Search, e.g. iPhone 14" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            {models === null ? (
              <p className="mt-4 text-gray-500">Loading models…</p>
            ) : matches.length === 0 ? (
              <p className="mt-4 text-gray-600">
                We don&apos;t have a price for that model online. <Link href="/contact" className="text-violet-700 font-semibold">Contact us</Link> for a quote.
              </p>
            ) : (
              <ul className="mt-4 grid sm:grid-cols-2 gap-2">
                {matches.map((m) => (
                  <li key={m.id}>
                    <button
                      type="button"
                      onClick={() => { setModel(m); getQuote(m, answers, payout); }}
                      className="w-full text-left rounded-xl border border-gray-200 p-3 hover:border-violet-400 hover:bg-violet-50"
                    >
                      <span className="font-semibold text-gray-900">{m.brand} {m.model}</span>
                      {m.storage && <span className="text-gray-500"> · {m.storage}</span>}
                      <span className="block text-xs text-gray-500">Up to {pounds(m.max_offer_pence)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </section>

      {/* 2. Condition and payout */}
      {model && (
        <section className={card}>
          <h2 className="text-lg font-bold text-gray-900">2. What condition is it in?</h2>
          <div className="mt-4 space-y-5">
            {QUESTIONS.map((q) => (
              <fieldset key={q.key}>
                <legend className="text-sm font-semibold text-gray-700 mb-2">{q.label}</legend>
                <div className="flex flex-wrap gap-2">
                  {q.options.map((o) => (
                    <button key={String(o.value)} type="button" className={choice(answers[q.key] === o.value)} onClick={() => answer(q.key, o.value)}>
                      {o.label}
                    </button>
                  ))}
                </div>
              </fieldset>
            ))}
            <fieldset>
              <legend className="text-sm font-semibold text-gray-700 mb-2">How would you like to be paid?</legend>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(PAYOUT_LABELS) as Payout[]).map((p) => (
                  <button key={p} type="button" className={choice(payout === p)} onClick={() => choosePayout(p)}>{PAYOUT_LABELS[p]}</button>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="mt-6 rounded-xl bg-gray-900 text-white p-5 flex flex-wrap items-center justify-between gap-4" aria-live="polite">
            {quote ? (
              <>
                <div>
                  <p className="text-sm text-gray-300">Your instant price · condition {quote.grade_label.toLowerCase()}</p>
                  <p className="text-3xl font-bold">{pounds(quote.quote_pence)}</p>
                  <p className="text-xs text-gray-400 mt-1">Valid for {quote.valid_days} days. Final price after we check the device.</p>
                </div>
                {!details.name && !details.email ? (
                  <button type="button" onClick={startDetails} className="px-5 py-3 bg-white text-gray-900 rounded-xl font-semibold">Sell it</button>
                ) : null}
              </>
            ) : (
              <p className="text-gray-300">{quoting ? 'Working out your price…' : 'Answer the questions to see your price.'}</p>
            )}
          </div>
        </section>
      )}

      {/* 3. Details */}
      {model && quote && (
        <form onSubmit={submit} className={card}>
          <h2 className="text-lg font-bold text-gray-900">3. Your details</h2>
          <div className="mt-4 grid sm:grid-cols-2 gap-4">
            <label className="block"><span className="block text-sm font-semibold text-gray-700 mb-1.5">Full name</span>
              <input className={inputClass} value={details.name} onChange={(e) => setDetails((d) => ({ ...d, name: e.target.value }))} required minLength={2} autoComplete="name" />
            </label>
            <label className="block"><span className="block text-sm font-semibold text-gray-700 mb-1.5">Email</span>
              <input className={inputClass} type="email" value={details.email} onChange={(e) => setDetails((d) => ({ ...d, email: e.target.value }))} required autoComplete="email" />
            </label>
            <label className="block"><span className="block text-sm font-semibold text-gray-700 mb-1.5">Mobile number</span>
              <input className={inputClass} type="tel" value={details.phone} onChange={(e) => setDetails((d) => ({ ...d, phone: e.target.value }))} required minLength={7} autoComplete="tel" />
            </label>
            <label className="block"><span className="block text-sm font-semibold text-gray-700 mb-1.5">IMEI or serial <span className="font-normal text-gray-400">(optional)</span></span>
              <input className={inputClass} value={details.imei} onChange={(e) => setDetails((d) => ({ ...d, imei: e.target.value }))} />
            </label>
          </div>
          <fieldset className="mt-4">
            <legend className="text-sm font-semibold text-gray-700 mb-2">How will you get it to us?</legend>
            <div className="flex flex-wrap gap-2">
              <button type="button" className={choice(details.delivery_method === 'drop_off')} onClick={() => setDetails((d) => ({ ...d, delivery_method: 'drop_off' }))}>Drop it at the shop</button>
              <button type="button" className={choice(details.delivery_method === 'post')} onClick={() => setDetails((d) => ({ ...d, delivery_method: 'post' }))}>Post it to us</button>
            </div>
          </fieldset>
          {/* Hidden from people; bots fill it in. */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" value={details.website} onChange={(e) => setDetails((d) => ({ ...d, website: e.target.value }))} />
          <p className="mt-4 text-xs text-gray-500">Please remove your passcode, sign out of iCloud or Google, and back up your data before you send it. We wipe every device we buy.</p>
          {error && <p role="alert" className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">{error}</p>}
          <button type="submit" disabled={busy} className="mt-5 w-full sm:w-auto px-6 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 disabled:opacity-60">
            {busy ? 'Sending…' : `Sell for ${pounds(quote.quote_pence)}`}
          </button>
        </form>
      )}
    </div>
  );
}

function Confirmation({ t }: { t: TradeIn }) {
  const trackHref = `/trade-in/track?id=${encodeURIComponent(t.trade_in_number)}&code=${encodeURIComponent(t.tracking_code || '')}`;
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <FaCheckCircle className="w-14 h-14 text-green-500 mx-auto" />
        <h2 className="text-2xl font-bold text-gray-900 mt-4">Trade-in requested</h2>
        <p className="text-gray-600 mt-2">
          Your price is {pounds(t.quoted_pence)} for your {t.device.brand} {t.device.model}. Keep these details to track it.
        </p>
        <dl className="mt-6 grid grid-cols-2 gap-4 text-left">
          <div className="rounded-xl bg-gray-50 p-4"><dt className="text-xs uppercase text-gray-500 font-semibold">Trade-in ID</dt><dd className="font-mono font-bold text-gray-900">{t.trade_in_number}</dd></div>
          <div className="rounded-xl bg-gray-50 p-4"><dt className="text-xs uppercase text-gray-500 font-semibold">Tracking code</dt><dd className="font-mono font-bold text-gray-900">{t.tracking_code}</dd></div>
        </dl>
        <p className="mt-6 text-sm text-gray-700">
          {t.delivery_method === 'post'
            ? 'Post your device to the shop with a note of your trade-in ID inside. We will check it within 2 working days of it arriving.'
            : 'Bring your device to the shop and give us your trade-in ID. We check it while you wait.'}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href={trackHref} className="px-6 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700">Track this trade-in</Link>
          <Link href="/" className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100">Back to shop</Link>
        </div>
      </div>
    </div>
  );
}
