"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { FaCheckCircle, FaCopy, FaMapMarkerAlt, FaShippingFast, FaTools } from 'react-icons/fa';
import Navbar from '../../../components/common/Navbar';
import Footer from '../../../components/common/Footer';
import { BookingResult, repairErrorMessage, repairService } from '../../../services/repairService';

const DEVICE_TYPES = ['Phone', 'Tablet', 'Laptop', 'Desktop', 'Console', 'Smartwatch', 'Other'];

interface Form {
  name: string;
  phone: string;
  email: string;
  address: string;
  device_type: string;
  brand: string;
  model: string;
  colour: string;
  serial_imei: string;
  reported_fault: string;
  delivery_method: 'drop_off' | 'post';
  website: string;
  agree: boolean;
}

const initial: Form = {
  name: '', phone: '', email: '', address: '',
  device_type: 'Phone', brand: '', model: '', colour: '', serial_imei: '',
  reported_fault: '', delivery_method: 'drop_off', website: '', agree: false,
};

const inputClass =
  'w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800';

function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</span>
      {children}
      {error ? <span className="block text-xs text-rose-600 mt-1">{error}</span> : hint ? <span className="block text-xs text-gray-500 mt-1">{hint}</span> : null}
    </label>
  );
}

export default function BookRepairPage() {
  const [form, setForm] = useState<Form>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [booking, setBooking] = useState<BookingResult | null>(null);

  const set = <K extends keyof Form>(key: K, value: Form[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = () => {
    const e: Partial<Record<keyof Form, string>> = {};
    if (form.name.trim().length < 2) e.name = 'Please enter your name';
    if (!/^[0-9+()\-\s]{7,}$/.test(form.phone.trim()) || form.phone.replace(/\D/g, '').length < 7) e.phone = 'Please enter a valid phone number';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Please enter a valid email address';
    if (form.reported_fault.trim().length < 10) e.reported_fault = 'Tell us a little more about the problem (at least 10 characters)';
    if (!form.agree) e.agree = 'Please accept the repair terms';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setServerError(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      const optional = (v: string) => (v.trim() ? v.trim() : undefined);
      const result = await repairService.book({
        customer: { name: form.name.trim(), phone: form.phone.trim(), email: form.email.trim(), address: optional(form.address) },
        device_type: form.device_type,
        brand: optional(form.brand),
        model: optional(form.model),
        colour: optional(form.colour),
        serial_imei: optional(form.serial_imei),
        reported_fault: form.reported_fault.trim(),
        delivery_method: form.delivery_method,
        website: form.website,
      });
      setBooking(result);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setServerError(repairErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="flex items-center gap-3 text-blue-100 text-sm font-semibold uppercase tracking-wider">
              <FaTools /> Repairs
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mt-2">Book a repair</h1>
            <p className="mt-2 text-blue-100 max-w-2xl">
              Tell us what is wrong. You will get a repair ID straight away, and you can follow every step online until your device is ready.
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-10">
          {booking ? (
            <Confirmation booking={booking} />
          ) : (
            <form onSubmit={submit} noValidate className="space-y-6">
              <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <h2 className="text-lg font-bold text-gray-900">Your details</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <Field label="Full name" error={errors.name}>
                    <input className={inputClass} value={form.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" />
                  </Field>
                  <Field label="Phone" error={errors.phone} hint="We will call or text you about your repair.">
                    <input className={inputClass} value={form.phone} onChange={(e) => set('phone', e.target.value)} type="tel" autoComplete="tel" />
                  </Field>
                  <Field label="Email" error={errors.email}>
                    <input className={inputClass} value={form.email} onChange={(e) => set('email', e.target.value)} type="email" autoComplete="email" />
                  </Field>
                  <Field label="Address (optional)" hint="Needed if we are posting the device back to you.">
                    <input className={inputClass} value={form.address} onChange={(e) => set('address', e.target.value)} autoComplete="street-address" />
                  </Field>
                </div>
              </section>

              <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <h2 className="text-lg font-bold text-gray-900">Your device</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <Field label="Type">
                    <select className={inputClass} value={form.device_type} onChange={(e) => set('device_type', e.target.value)}>
                      {DEVICE_TYPES.map((d) => <option key={d}>{d}</option>)}
                    </select>
                  </Field>
                  <Field label="Brand">
                    <input className={inputClass} value={form.brand} onChange={(e) => set('brand', e.target.value)} placeholder="e.g. Apple" />
                  </Field>
                  <Field label="Model">
                    <input className={inputClass} value={form.model} onChange={(e) => set('model', e.target.value)} placeholder="e.g. iPhone 13" />
                  </Field>
                  <Field label="Colour (optional)">
                    <input className={inputClass} value={form.colour} onChange={(e) => set('colour', e.target.value)} />
                  </Field>
                  <Field label="Serial or IMEI (optional)">
                    <input className={inputClass} value={form.serial_imei} onChange={(e) => set('serial_imei', e.target.value)} />
                  </Field>
                </div>
                <Field label="What is wrong with it?" error={errors.reported_fault}>
                  <textarea
                    className={inputClass}
                    rows={4}
                    value={form.reported_fault}
                    onChange={(e) => set('reported_fault', e.target.value)}
                    placeholder="e.g. Screen cracked after a drop, touch not working at the top"
                  />
                </Field>
                <p className="text-xs text-gray-500">Please do not include your device passcode here. We will ask for it in the shop if we need it.</p>
              </section>

              <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <h2 className="text-lg font-bold text-gray-900">How will you get it to us?</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {([
                    { value: 'drop_off', icon: FaMapMarkerAlt, title: 'Drop it off', text: 'Bring it to our shop. Show your repair ID at the counter.' },
                    { value: 'post', icon: FaShippingFast, title: 'Post it', text: 'Send it to us with a note showing your repair ID.' },
                  ] as const).map((o) => (
                    <button
                      type="button"
                      key={o.value}
                      onClick={() => set('delivery_method', o.value)}
                      aria-pressed={form.delivery_method === o.value}
                      className={`text-left p-4 rounded-xl border-2 transition-all ${form.delivery_method === o.value ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <o.icon className={form.delivery_method === o.value ? 'text-blue-600' : 'text-gray-400'} />
                      <div className="font-semibold mt-2">{o.title}</div>
                      <div className="text-sm text-gray-600">{o.text}</div>
                    </button>
                  ))}
                </div>
              </section>

              {/* Honeypot: hidden from people, filled in by bots. */}
              <div aria-hidden="true" className="absolute -left-[10000px] w-px h-px overflow-hidden">
                <label>
                  Website
                  <input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set('website', e.target.value)} />
                </label>
              </div>

              <div className="space-y-3">
                <label className="flex items-start gap-3 text-sm text-gray-700">
                  <input type="checkbox" className="mt-1" checked={form.agree} onChange={(e) => set('agree', e.target.checked)} />
                  <span>
                    I understand the quote may change after diagnosis (you will ask me before doing extra work), I am responsible for backing up my data, and I agree to the{' '}
                    <Link href="/privacy-policy" className="text-blue-600 hover:underline">privacy policy</Link>.
                  </span>
                </label>
                {errors.agree && <p className="text-xs text-rose-600">{errors.agree}</p>}
                {serverError && <div className="rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-sm px-4 py-3">{serverError}</div>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full md:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors"
                >
                  {submitting ? 'Booking…' : 'Book my repair'}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function Confirmation({ booking }: { booking: BookingResult }) {
  const [copied, setCopied] = useState(false);
  const trackHref = `/repairs/track?id=${encodeURIComponent(booking.repair_number)}&code=${encodeURIComponent(booking.tracking_code)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`Repair ID: ${booking.repair_number}\nTracking code: ${booking.tracking_code}`);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">
      <div className="flex items-center gap-3 text-emerald-600">
        <FaCheckCircle className="text-3xl" />
        <h2 className="text-2xl font-bold text-gray-900">Your repair is booked</h2>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">Repair ID</div>
          <div className="text-2xl font-bold font-mono text-gray-900 mt-1">{booking.repair_number}</div>
        </div>
        <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">Tracking code</div>
          <div className="text-2xl font-bold font-mono text-gray-900 mt-1">{booking.tracking_code}</div>
        </div>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <b>Save these now.</b> You need both to see your repair online. Keep the tracking code private: anyone with it can see and approve your quote.
        <button onClick={copy} className="ml-2 inline-flex items-center gap-1 font-semibold underline">
          <FaCopy /> {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div>
        <h3 className="font-bold text-gray-900 mb-2">What happens next</h3>
        <ol className="list-decimal pl-5 space-y-1.5 text-gray-700">
          {booking.delivery_method === 'post' ? (
            <li>Post your device to us, well packed, with a note showing <b>{booking.repair_number}</b>. Remove any SIM or memory card you want to keep.</li>
          ) : (
            <li>Bring your device to our shop and give us your repair ID <b>{booking.repair_number}</b> at the counter.</li>
          )}
          <li>We check it in, inspect it and send you a quote. You can approve or decline it on the tracking page.</li>
          <li>Once it is fixed we let you know it is ready to collect.</li>
        </ol>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href={trackHref} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors">
          Track this repair
        </Link>
        <Link href="/contact" className="px-6 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 font-semibold rounded-xl transition-colors">
          Contact us
        </Link>
      </div>
    </div>
  );
}
