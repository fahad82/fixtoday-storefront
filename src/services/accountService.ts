// services/accountService.ts: customer sign-up, sign-in and the account dashboard.
import axios from 'axios';
import { api } from './api';
import type { CustomerOrder } from './orderService';
import type { TrackedRepair } from './repairService';

export interface Account {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  created_at: string;
}

export type AccountRepair = TrackedRepair & { tracking_code: string };

export const TOKEN_KEY = 'authToken'; // the same key api.ts sends with every request

export function accountErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const message = (err.response?.data as { error?: string } | undefined)?.error;
    if (status === 429) return 'Too many attempts. Please wait a few minutes and try again.';
    if (status === 400 && message === 'Validation error') return 'Please check the details you entered.';
    if (message && status && status < 500) return message;
    if (!err.response) return 'We could not reach our server. Check your connection and try again.';
  }
  return 'Something went wrong on our side. Please try again.';
}

type AuthResult = { user: Account; token: string };

export const accountService = {
  async register(body: { name: string; email: string; password: string; phone?: string }): Promise<AuthResult> {
    return api.post<AuthResult>('/api/account/register', body);
  },
  async login(email: string, password: string): Promise<AuthResult> {
    return api.post<AuthResult>('/api/account/login', { email, password });
  },
  async me(): Promise<Account> {
    return (await api.get<{ user: Account }>('/api/account/me')).user;
  },
  async update(body: { name?: string; phone?: string }): Promise<Account> {
    return (await api.put<{ user: Account }>('/api/account/me', body)).user;
  },
  async changePassword(current_password: string, new_password: string): Promise<void> {
    await api.post('/api/account/password', { current_password, new_password });
  },
  async orders(): Promise<CustomerOrder[]> {
    return (await api.get<{ orders: CustomerOrder[] }>('/api/account/orders')).orders;
  },
  async addOrder(order_number: string): Promise<CustomerOrder> {
    return (await api.post<{ order: CustomerOrder }>('/api/account/orders/add', { order_number })).order;
  },
  async repairs(): Promise<AccountRepair[]> {
    return (await api.get<{ repairs: AccountRepair[] }>('/api/account/repairs')).repairs;
  },
  async addRepair(repair_number: string, tracking_code: string): Promise<AccountRepair> {
    return (await api.post<{ repair: AccountRepair }>('/api/account/repairs/add', { repair_number, tracking_code })).repair;
  },
};
