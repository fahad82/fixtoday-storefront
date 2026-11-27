"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaBoxOpen, FaChevronDown, FaChevronUp, FaSignOutAlt, FaTools, FaUserCog } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import OrderSummaryCard from '@/components/orders/OrderSummaryCard';
import { AccountRepair, accountErrorMessage, accountService } from '@/services/accountService';
import { CustomerOrder, ORDER_STATUS_LABELS, PAYMENT_LABELS } from '@/services/orderService';
import { formatDate, formatMoney } from '@/services/repairService';
import { inputClass } from './AuthCard';

type Tab = 'orders' | 'repairs' | 'profile';
const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'orders', label: 'Orders', icon: <FaBoxOpen /> },
  { id: 'repairs', label: 'Repairs', icon: <FaTools /> },
  { id: 'profile', label: 'Profile', icon: <FaUserCog /> },
];

export default function AccountDashboard() {
  const { user, isReady, logout } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const tab = (TABS.find((t) => t.id === params.get('tab'))?.id || 'orders') as Tab;

  useEffect(() => {
    if (isReady && !user) router.replace('/account/login?next=/account');
  }, [isReady, user, router]);

  if (!isReady || !user) return <div className="py-24 text-center text-gray-500">Loading…</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-500">My account</p>
          <h1 className="text-3xl font-bold text-gray-900">Hello, {user.name.split(' ')[0]}</h1>
        </div>
        <button
          onClick={() => { logout(); router.replace('/'); }}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100"
        >
          <FaSignOutAlt /> Sign out
        </button>
      </div>

      <nav className="flex gap-2 border-b border-gray-200 mb-6" aria-label="Account sections">
        {TABS.map((t) => (
          <Link
            key={t.id}
            href={`/account?tab=${t.id}`}
            scroll={false}
            className={`inline-flex items-center gap-2 px-4 py-3 -mb-px border-b-2 text-sm font-semibold ${
              tab === t.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {t.icon} {t.label}
          </Link>
        ))}
      </nav>

      {tab === 'orders' && <OrdersTab />}
      {tab === 'repairs' && <RepairsTab />}
      {tab === 'profile' && <ProfileTab />}
    </div>
  );
}

function OrdersTab() {
  const [orders, setOrders] = useState<CustomerOrder[] | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [number, setNumber] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    accountService.orders().then(setOrders).catch(() => setOrders([]));
  }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const order = await accountService.addOrder(number.trim());
      setOrders((list) => [order, ...(list || []).filter((o) => o.order_number !== order.order_number)]);
      setNumber('');
      toast.success(`Order ${order.order_number} added to your account`);
    } catch (err) {
      setError(accountErrorMessage(err));
    }
  };

  if (!orders) return <p className="text-gray-500">Loading your orders…</p>;
  return (
    <div className="space-y-4">
      {orders.length === 0 && (
        <Empty text="No orders yet." action={<Link href="/" className="text-blue-600 font-semibold">Start shopping</Link>} />
      )}
      {orders.map((o) => (
        <div key={o.order_number} className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <button
            onClick={() => setOpen(open === o.order_number ? null : o.order_number)}
            className="w-full p-5 flex flex-wrap items-center justify-between gap-3 text-left"
            aria-expanded={open === o.order_number}
          >
            <div>
              <p className="font-mono font-bold text-gray-900">{o.order_number}</p>
              <p className="text-sm text-gray-500">
                {formatDate(o.created_at)} · {o.items.reduce((n, i) => n + i.quantity, 0)} item(s) · £{Number(o.total).toFixed(2)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-700">{ORDER_STATUS_LABELS[o.status]}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">{PAYMENT_LABELS[o.payment_status] || o.payment_status}</span>
              {open === o.order_number ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
            </div>
          </button>
          {open === o.order_number && <div className="px-5 pb-5"><OrderSummaryCard order={o} /></div>}
        </div>
      ))}
      <AddForm
        title="Ordered without signing in?"
        hint="Add it with the order number from your confirmation. It must have been placed with this account's email."
        onSubmit={add}
        error={error}
      >
        <input className={`${inputClass} font-mono uppercase`} placeholder="ORD-2611-00001" value={number} onChange={(e) => setNumber(e.target.value)} required minLength={4} />
      </AddForm>
    </div>
  );
}

function RepairsTab() {
  const [repairs, setRepairs] = useState<AccountRepair[] | null>(null);
  const [form, setForm] = useState({ number: '', code: '' });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    accountService.repairs().then(setRepairs).catch(() => setRepairs([]));
  }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const repair = await accountService.addRepair(form.number.trim(), form.code.trim());
      setRepairs((list) => [repair, ...(list || []).filter((r) => r.repair_number !== repair.repair_number)]);
      setForm({ number: '', code: '' });
      toast.success(`Repair ${repair.repair_number} added to your account`);
    } catch (err) {
      setError(accountErrorMessage(err));
    }
  };

  if (!repairs) return <p className="text-gray-500">Loading your repairs…</p>;
  return (
    <div className="space-y-4">
      {repairs.length === 0 && (
        <Empty text="No repairs on your account yet." action={<Link href="/repairs/book" className="text-blue-600 font-semibold">Book a repair</Link>} />
      )}
      {repairs.map((r) => {
        const device = [r.device.brand, r.device.model].filter(Boolean).join(' ') || r.device.type;
        return (
          <div key={r.repair_number} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-mono font-bold text-gray-900">{r.repair_number}</p>
              <p className="text-sm text-gray-700">{device}</p>
              <p className="text-sm text-gray-500">
                {r.status_label}
                {r.balance_pence > 0 ? ` · ${formatMoney(r.balance_pence)} to pay` : ''}
                {r.warranty_expires_at ? ` · Warranty until ${formatDate(r.warranty_expires_at)}` : ''}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {r.can_respond_to_quote && (
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-amber-100 text-amber-800">Quote waiting for you</span>
              )}
              <Link
                href={`/repairs/track?id=${encodeURIComponent(r.repair_number)}&code=${encodeURIComponent(r.tracking_code)}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700"
              >
                View details
              </Link>
            </div>
          </div>
        );
      })}
      <AddForm
        title="Repair booked in the shop?"
        hint="Add it with the repair ID and tracking code printed on your slip."
        onSubmit={add}
        error={error}
      >
        <input className={`${inputClass} font-mono uppercase`} placeholder="FT-R-2611-0001" value={form.number} onChange={(e) => setForm((f) => ({ ...f, number: e.target.value }))} required minLength={6} />
        <input className={`${inputClass} font-mono uppercase`} placeholder="Tracking code" value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} required minLength={8} />
      </AddForm>
    </div>
  );
}

function ProfileTab() {
  const { user, setUser } = useAuth();
  const [details, setDetails] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [pw, setPw] = useState({ current: '', next: '' });
  const [busy, setBusy] = useState<'details' | 'password' | null>(null);

  const saveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy('details');
    try {
      setUser(await accountService.update({ name: details.name.trim(), phone: details.phone.trim() }));
      toast.success('Details saved');
    } catch (err) {
      toast.error(accountErrorMessage(err));
    } finally {
      setBusy(null);
    }
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy('password');
    try {
      await accountService.changePassword(pw.current, pw.next);
      setPw({ current: '', next: '' });
      toast.success('Password changed');
    } catch (err) {
      toast.error(accountErrorMessage(err));
    } finally {
      setBusy(null);
    }
  };

  const card = 'bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4';
  const label = 'block text-sm font-semibold text-gray-700 mb-2';
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <form onSubmit={saveDetails} className={card}>
        <h2 className="font-bold text-gray-900">Your details</h2>
        <label className="block"><span className={label}>Full name</span>
          <input className={inputClass} value={details.name} onChange={(e) => setDetails((d) => ({ ...d, name: e.target.value }))} required minLength={2} />
        </label>
        <label className="block"><span className={label}>Email</span>
          <input className={`${inputClass} bg-gray-50 text-gray-500`} value={user?.email || ''} disabled />
        </label>
        <label className="block"><span className={label}>Mobile number</span>
          <input className={inputClass} type="tel" value={details.phone} onChange={(e) => setDetails((d) => ({ ...d, phone: e.target.value }))} />
        </label>
        <button disabled={busy === 'details'} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-60">
          {busy === 'details' ? 'Saving…' : 'Save details'}
        </button>
      </form>
      <form onSubmit={savePassword} className={card}>
        <h2 className="font-bold text-gray-900">Change password</h2>
        <label className="block"><span className={label}>Current password</span>
          <input className={inputClass} type="password" autoComplete="current-password" value={pw.current} onChange={(e) => setPw((p) => ({ ...p, current: e.target.value }))} required />
        </label>
        <label className="block"><span className={label}>New password</span>
          <input className={inputClass} type="password" autoComplete="new-password" value={pw.next} onChange={(e) => setPw((p) => ({ ...p, next: e.target.value }))} required minLength={8} />
        </label>
        <button disabled={busy === 'password'} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-60">
          {busy === 'password' ? 'Saving…' : 'Change password'}
        </button>
      </form>
    </div>
  );
}

function Empty({ text, action }: { text: string; action: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-10 text-center">
      <p className="text-gray-600">{text}</p>
      <div className="mt-2">{action}</div>
    </div>
  );
}

function AddForm({ title, hint, onSubmit, error, children }: {
  title: string; hint: string; onSubmit: (e: React.FormEvent) => void; error: string | null; children: React.ReactNode;
}) {
  return (
    <form onSubmit={onSubmit} className="bg-gray-100/70 rounded-2xl p-5 space-y-3">
      <div>
        <p className="font-semibold text-gray-900">{title}</p>
        <p className="text-sm text-gray-600">{hint}</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        {children}
        <button className="px-5 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-black whitespace-nowrap">Add</button>
      </div>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    </form>
  );
}
