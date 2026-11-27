// services/tradeInService.ts: sell or trade in a device (public API, no sign-in needed).
import axios from 'axios';
import { api } from './api';

export interface TradeInModel {
  id: string;
  device_type: string;
  brand: string;
  model: string;
  storage: string;
  max_offer_pence: number;
}

export interface Answers {
  powers_on: boolean;
  screen: 'perfect' | 'scratched' | 'cracked';
  body: 'perfect' | 'worn' | 'damaged';
  battery_ok: boolean;
}

export type Payout = 'bank' | 'store_credit' | 'cash';

export interface Quote {
  grade: 'like_new' | 'good' | 'fair' | 'faulty';
  grade_label: string;
  quote_pence: number;
  valid_days: number;
}

export type TradeInStatus =
  | 'submitted' | 'received' | 'offer_confirmed' | 'revised_offer' | 'accepted'
  | 'declined' | 'rejected' | 'paid' | 'returned' | 'cancelled';

export interface TradeIn {
  trade_in_number: string;
  tracking_code?: string;
  status: TradeInStatus;
  status_label: string;
  device: { type: string; brand: string; model: string; storage: string };
  grade: Quote['grade'];
  grade_label: string;
  payout_method: Payout;
  quoted_pence: number;
  offered_pence: number | null;
  quote_expires_at: string;
  delivery_method: 'drop_off' | 'post';
  can_respond: boolean;
  can_cancel: boolean;
  created_at: string;
  timeline: { status: TradeInStatus | null; status_label: string | null; note: string | null; at: string }[];
}

export const PAYOUT_LABELS: Record<Payout, string> = {
  bank: 'Bank transfer',
  store_credit: 'Shop credit (+10%)',
  cash: 'Cash in shop',
};

export const pounds = (pence: number | null | undefined) =>
  pence == null ? '—' : `£${(pence / 100).toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

export function tradeInErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const message = (err.response?.data as { error?: string } | undefined)?.error;
    if (status === 429) return 'Too many attempts. Please wait a few minutes and try again.';
    if (status === 400 && message === 'Validation error') return 'Please check the details you entered.';
    if (message && status && status < 500) return message;
    if (!err.response) return 'We could not reach our server. Check your connection and try again.';
  }
  return 'Something went wrong on our side. Please try again, or call us.';
}

type Lookup = { trade_in_number: string; tracking_code: string };

export const tradeInService = {
  async models(q?: string): Promise<TradeInModel[]> {
    const res = await api.get<{ models: TradeInModel[] }>('/api/public/trade-in/models', q ? { q } : undefined);
    return res.models;
  },
  async quote(model_id: string, answers: Answers, payout_method: Payout): Promise<Quote> {
    return api.post<Quote>('/api/public/trade-in/quote', { model_id, answers, payout_method });
  },
  async submit(body: {
    model_id: string; answers: Answers; payout_method: Payout; imei?: string; delivery_method: 'drop_off' | 'post';
    customer: { name: string; email: string; phone: string }; website?: string;
  }): Promise<TradeIn> {
    return (await api.post<{ trade_in: TradeIn }>('/api/public/trade-in', body)).trade_in;
  },
  async track(lookup: Lookup): Promise<TradeIn> {
    return (await api.post<{ trade_in: TradeIn }>('/api/public/trade-in/track', lookup)).trade_in;
  },
  async respond(lookup: Lookup, decision: 'accept' | 'decline' | 'cancel'): Promise<TradeIn> {
    return (await api.post<{ trade_in: TradeIn }>('/api/public/trade-in/respond', { ...lookup, decision })).trade_in;
  },
};
