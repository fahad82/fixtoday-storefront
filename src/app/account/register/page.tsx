"use client";

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { accountErrorMessage } from '@/services/accountService';
import AuthCard, { inputClass, safeNext } from '../AuthCard';

function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const next = safeNext(useSearchParams().get('next'));
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        ...(form.phone.trim() && { phone: form.phone.trim() }),
      });
      router.replace(next);
    } catch (err) {
      setError(accountErrorMessage(err));
      setBusy(false);
    }
  };

  return (
    <AuthCard
      title="Create your account"
      subtitle="Track orders and repairs, and check out faster."
      footer={<>Already have an account? <Link href={`/account/login?next=${encodeURIComponent(next)}`} className="font-semibold text-blue-600">Sign in</Link></>}
    >
      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          <span className="block text-sm font-semibold text-gray-700 mb-2">Full name</span>
          <input className={inputClass} autoComplete="name" value={form.name} onChange={set('name')} required minLength={2} />
        </label>
        <label className="block">
          <span className="block text-sm font-semibold text-gray-700 mb-2">Email</span>
          <input className={inputClass} type="email" autoComplete="email" value={form.email} onChange={set('email')} required />
        </label>
        <label className="block">
          <span className="block text-sm font-semibold text-gray-700 mb-2">Mobile number <span className="font-normal text-gray-400">(optional)</span></span>
          <input className={inputClass} type="tel" autoComplete="tel" value={form.phone} onChange={set('phone')} />
        </label>
        <label className="block">
          <span className="block text-sm font-semibold text-gray-700 mb-2">Password</span>
          <input className={inputClass} type="password" autoComplete="new-password" value={form.password} onChange={set('password')} required minLength={8} />
          <span className="block text-xs text-gray-500 mt-1">At least 8 characters.</span>
        </label>
        {error && <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">{error}</p>}
        <button type="submit" disabled={busy} className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-60">
          {busy ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </AuthCard>
  );
}

export default function RegisterPage() {
  return <Suspense><RegisterForm /></Suspense>;
}
