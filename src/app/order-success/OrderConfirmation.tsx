"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FaCheckCircle, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import { useCart } from '@/hooks/useCart';
import OrderSummaryCard from '@/components/orders/OrderSummaryCard';
import { CustomerOrder, orderService } from '@/services/orderService';

const POLL_MS = 3000;
const MAX_POLLS = 10;

type State = { order: CustomerOrder | null; error: string | null; polls: number };

export default function OrderConfirmation() {
  const sessionId = useSearchParams().get('session_id');
  const { clearCart } = useCart();
  const cleared = useRef(false);
  const [state, setState] = useState<State>({ order: null, error: null, polls: 0 });

  // Load the order, and keep checking for a short while if the payment is still settling.
  useEffect(() => {
    if (!sessionId) return;
    let stopped = false;
    let timer: ReturnType<typeof setTimeout>;
    let polls = 0;
    const load = () => {
      orderService
        .orderForStripeSession(sessionId)
        .then((order) => {
          if (stopped) return;
          polls += 1;
          setState({ order, error: null, polls });
          const settling = order.payment_status === 'awaiting_payment' || order.payment_status === 'processing';
          if (settling && polls < MAX_POLLS) timer = setTimeout(load, POLL_MS);
        })
        .catch(() => {
          if (!stopped) setState((s) => ({ ...s, error: 'We could not find this order.' }));
        });
    };
    load();
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [sessionId]);

  const order = state.order;
  const paid = order?.payment_status === 'paid' || order?.payment_status === 'processing' || order?.payment_status === 'needs_review';

  // Empty the basket once, when the payment has gone through.
  useEffect(() => {
    if (paid && !cleared.current) {
      cleared.current = true;
      clearCart();
    }
  }, [paid, clearCart]);

  if (!sessionId || state.error) {
    return (
      <Message
        icon={<FaExclamationTriangle className="w-10 h-10 text-amber-500" />}
        title="We couldn't find that order"
        text="If you paid, you will get an email from Stripe with your receipt. You can also look up your order with its number and your email."
      />
    );
  }
  if (!order) return <div className="py-24 text-center text-gray-500">Loading your order…</div>;

  const failed = order.status === 'cancelled' && !paid;
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
      <div className="text-center">
        {failed ? (
          <FaExclamationTriangle className="w-14 h-14 text-amber-500 mx-auto" />
        ) : paid ? (
          <FaCheckCircle className="w-14 h-14 text-green-500 mx-auto" />
        ) : (
          <FaClock className="w-14 h-14 text-blue-500 mx-auto" />
        )}
        <h1 className="text-3xl font-bold text-gray-900 mt-4">
          {failed ? 'Payment not completed' : paid ? `Thank you, ${order.first_name}!` : 'Confirming your payment…'}
        </h1>
        <p className="text-gray-600 mt-2 max-w-xl mx-auto">
          {failed
            ? 'Your card was not charged and this order was cancelled. Your basket is still saved if you want to try again.'
            : paid
              ? `Your order is confirmed. We have sent the receipt to ${order.email}. Keep your order number to track it.`
              : state.polls >= MAX_POLLS
                ? 'This is taking longer than usual. You will get an email when the payment is confirmed, and you can check this page again later.'
                : 'This usually takes a few seconds. Please keep this page open.'}
        </p>
      </div>

      <OrderSummaryCard order={order} />

      <div className="flex flex-wrap justify-center gap-3">
        {failed ? (
          <Link href="/checkout" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700">Try again</Link>
        ) : (
          <Link href={`/track-order?order=${encodeURIComponent(order.order_number)}`} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700">
            Track this order
          </Link>
        )}
        <Link href="/" className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100">Continue shopping</Link>
      </div>
    </div>
  );
}

function Message({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <div className="flex justify-center">{icon}</div>
      <h1 className="text-2xl font-bold text-gray-900 mt-4">{title}</h1>
      <p className="text-gray-600 mt-2">{text}</p>
      <Link href="/track-order" className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700">
        Find my order
      </Link>
    </div>
  );
}
