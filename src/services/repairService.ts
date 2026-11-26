// services/repairService.ts: online repair booking and tracking (public API, no sign-in).
import axios from 'axios';
import { api } from './api';

export type RepairStatus =
  | 'booked' | 'received' | 'diagnosing' | 'awaiting_approval' | 'approved' | 'declined'
  | 'in_repair' | 'waiting_parts' | 'repaired' | 'unrepairable'
  | 'ready_for_collection' | 'released' | 'cancelled';

export interface BookingRequest {
  customer: { name: string; phone: string; email: string; address?: string };
  device_type: string;
  brand?: string;
  model?: string;
  colour?: string;
  serial_imei?: string;
  reported_fault: string;
  delivery_method: 'drop_off' | 'post';
  website?: string; // honeypot, always empty for people
}

export interface BookingResult {
  repair_number: string;
  tracking_code: string;
  status: RepairStatus;
  status_label: string;
  delivery_method: 'drop_off' | 'post';
}

export interface TrackedRepair {
  repair_number: string;
  status: RepairStatus;
  status_label: string;
  channel: 'walk_in' | 'online';
  device: { type: string; brand: string | null; model: string | null };
  reported_fault: string;
  quoted_cost_pence: number | null;
  estimated_cost_pence: number | null;
  amount_due_pence: number;
  paid_pence: number;
  balance_pence: number;
  can_respond_to_quote: boolean;
  expected_ready_at: string | null;
  received_at: string | null;
  ready_at: string | null;
  released_at: string | null;
  warranty_days: number | null;
  warranty_expires_at: string | null;
  timeline: { type: string; status: RepairStatus | null; status_label: string | null; note: string | null; at: string }[];
  shop: { name: string; phone: string | null; email: string | null; address: string | null };
}

export type Lookup = { repair_number: string; tracking_code?: string; phone_last4?: string };

// Turns an API failure into a sentence a customer can act on.
export function repairErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const message = (err.response?.data as { error?: string } | undefined)?.error;
    if (status === 429) return 'Too many attempts. Please wait a few minutes and try again.';
    if (status === 400) return 'Please check the details you entered and try again.';
    if (message && status && status < 500) return message;
    if (!err.response) return 'We could not reach our server. Check your connection and try again.';
  }
  return 'Something went wrong on our side. Please try again, or call us.';
}

export const repairService = {
  async book(body: BookingRequest): Promise<BookingResult> {
    const res = await api.post<{ success: boolean; repair: BookingResult }>('/api/public/repairs', body);
    return res.repair;
  },

  async track(lookup: Lookup): Promise<TrackedRepair> {
    const res = await api.post<{ success: boolean; repair: TrackedRepair }>('/api/public/repairs/track', lookup);
    return res.repair;
  },

  async respondToQuote(decision: 'approve' | 'decline', body: { repair_number: string; tracking_code: string; message?: string }): Promise<TrackedRepair> {
    const res = await api.post<{ success: boolean; repair: TrackedRepair }>(`/api/public/repairs/${decision}`, body);
    return res.repair;
  },
};

export const formatMoney = (pence: number | null | undefined) =>
  pence === null || pence === undefined
    ? '—'
    : new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(pence / 100);

export const formatDate = (iso: string | null | undefined, withTime = false) =>
  iso
    ? new Date(iso).toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        ...(withTime && { hour: '2-digit', minute: '2-digit' }),
      })
    : '—';
