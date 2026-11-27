// services/orderService.ts: online checkout with Stripe, order confirmation and order tracking.
import axios from 'axios';
import { api } from './api';

export type DeliveryMethod = 'express' | 'standard' | 'economy' | 'super-saver';

export interface CheckoutRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  postcode: string;
  country: string;
  deliveryMethod: DeliveryMethod;
  notes?: string;
  items: { productId: string; variantId?: string; quantity: number }[];
}

export type PaymentStatus =
  | 'pending' | 'awaiting_payment' | 'processing' | 'paid' | 'needs_review' | 'failed' | 'expired' | 'refunded';

export interface CustomerOrder {
  order_number: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  delivery_method: DeliveryMethod;
  delivery_estimated: string | null;
  delivery_tracking_number: string | null;
  delivery_status: string | null;
  city: string;
  postcode: string;
  subtotal: string;
  delivery_price: string;
  tax: string;
  total: string;
  payment_method: string;
  payment_status: PaymentStatus;
  paid_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
  items: { name: string; variantName: string | null; quantity: number; price: string; total: string; image: string | null }[];
}

// Kept in step with DELIVERY_OPTIONS on the server, which has the final say on price.
export const DELIVERY_OPTIONS: { id: DeliveryMethod; name: string; duration: string; price: number; estimated: string; freeOver?: number }[] = [
  { id: 'express', name: 'Express Delivery', duration: '2-3 Days', price: 9.99, estimated: 'Arrives in 2-3 business days' },
  { id: 'standard', name: 'Standard Delivery', duration: '3-5 Days', price: 4.99, estimated: 'Arrives in 3-5 business days', freeOver: 50 },
  { id: 'economy', name: 'Economy Delivery', duration: '5-7 Days', price: 2.99, estimated: 'Arrives in 5-7 business days' },
  { id: 'super-saver', name: 'Super Saver', duration: '7-10 Days', price: 0, estimated: 'Arrives in 7-10 business days' },
];

export const VAT_RATE = 0.2; // prices include VAT

export function deliveryPrice(method: DeliveryMethod, subtotal: number): number {
  const option = DELIVERY_OPTIONS.find((o) => o.id === method);
  if (!option) return 0;
  return option.freeOver !== undefined && subtotal >= option.freeOver ? 0 : option.price;
}

/** VAT already inside a VAT-inclusive amount. */
export const includedVat = (gross: number) => Math.round((gross * VAT_RATE * 100) / (1 + VAT_RATE)) / 100;

export function orderErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const message = (err.response?.data as { error?: string } | undefined)?.error;
    if (status === 429) return 'Too many attempts. Please wait a few minutes and try again.';
    if (status === 400 && message === 'Validation error') return 'Please check your details and try again.';
    if (message && status && status !== 500) return message;
    if (!err.response) return 'We could not reach our server. Check your connection and try again.';
  }
  return 'Something went wrong on our side. Please try again, or call us.';
}

export const PAYMENT_LABELS: Record<PaymentStatus, string> = {
  pending: 'Pay in shop',
  awaiting_payment: 'Waiting for payment',
  processing: 'Payment clearing',
  paid: 'Paid',
  needs_review: 'Being checked',
  failed: 'Payment failed',
  expired: 'Payment not completed',
  refunded: 'Refunded',
};

export const ORDER_STATUS_LABELS: Record<CustomerOrder['status'], string> = {
  pending: 'Order received',
  processing: 'Being prepared',
  shipped: 'On its way',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const orderService = {
  /** Creates the order and returns the Stripe payment page to send the customer to. */
  async startStripeCheckout(body: CheckoutRequest): Promise<{ url: string; order_number: string }> {
    const res = await api.post<{ success: boolean; url: string; order_number: string }>('/api/checkout/stripe', body);
    return { url: res.url, order_number: res.order_number };
  },

  async orderForStripeSession(sessionId: string): Promise<CustomerOrder> {
    const res = await api.get<{ success: boolean; order: CustomerOrder }>(`/api/checkout/stripe/session/${encodeURIComponent(sessionId)}`);
    return res.order;
  },

  async lookup(orderNumber: string, email: string): Promise<CustomerOrder> {
    const res = await api.post<{ success: boolean; order: CustomerOrder }>('/api/orders/lookup', { order_number: orderNumber, email });
    return res.order;
  },
};
