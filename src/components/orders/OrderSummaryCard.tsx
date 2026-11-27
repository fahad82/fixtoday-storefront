// The customer's view of one order: progress, items and totals.
import { FaBoxOpen, FaCheckCircle, FaShippingFast, FaStore, FaTimesCircle } from 'react-icons/fa';
import { CustomerOrder, ORDER_STATUS_LABELS, PAYMENT_LABELS } from '@/services/orderService';

const STEPS: CustomerOrder['status'][] = ['pending', 'processing', 'shipped', 'delivered'];
const money = (v: string | number) => `£${Number(v).toFixed(2)}`;
const date = (v: string | null) =>
  v ? new Date(v).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : null;

const paymentTone: Record<string, string> = {
  paid: 'bg-green-100 text-green-800',
  awaiting_payment: 'bg-amber-100 text-amber-800',
  processing: 'bg-amber-100 text-amber-800',
  needs_review: 'bg-amber-100 text-amber-800',
  pending: 'bg-blue-100 text-blue-800',
  refunded: 'bg-gray-100 text-gray-700',
};

export default function OrderSummaryCard({ order }: { order: CustomerOrder }) {
  const cancelled = order.status === 'cancelled';
  const current = STEPS.indexOf(order.status);
  const icons = [FaStore, FaBoxOpen, FaShippingFast, FaCheckCircle];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Order number</p>
          <p className="text-2xl font-bold text-gray-900 font-mono">{order.order_number}</p>
          <p className="text-sm text-gray-500 mt-1">Placed {date(order.created_at)}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${paymentTone[order.payment_status] || 'bg-red-100 text-red-800'}`}>
          {PAYMENT_LABELS[order.payment_status] || order.payment_status}
        </span>
      </div>

      <div className="p-6 border-b border-gray-100">
        {cancelled ? (
          <div className="flex items-center gap-3 text-red-700">
            <FaTimesCircle className="w-5 h-5" />
            <p className="font-semibold">This order was cancelled{order.cancelled_at ? ` on ${date(order.cancelled_at)}` : ''}.</p>
          </div>
        ) : (
          <ol className="grid grid-cols-4 gap-2" aria-label="Order progress">
            {STEPS.map((step, i) => {
              const Icon = icons[i];
              const done = i <= current;
              return (
                <li key={step} className="flex flex-col items-center text-center gap-2">
                  <span className={`w-10 h-10 rounded-full flex items-center justify-center ${done ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className={`text-xs font-medium ${done ? 'text-gray-900' : 'text-gray-400'}`}>{ORDER_STATUS_LABELS[step]}</span>
                </li>
              );
            })}
          </ol>
        )}
        {order.delivery_tracking_number && (
          <p className="mt-4 text-sm text-gray-700">
            Courier tracking number: <span className="font-mono font-semibold">{order.delivery_tracking_number}</span>
          </p>
        )}
        {!cancelled && order.delivery_estimated && order.status !== 'delivered' && (
          <p className="mt-2 text-sm text-gray-500">{order.delivery_estimated}</p>
        )}
      </div>

      <ul className="divide-y divide-gray-100">
        {order.items.map((item, i) => (
          <li key={i} className="p-4 px-6 flex items-center justify-between gap-4 text-sm">
            <div>
              <p className="font-medium text-gray-900">{item.name}</p>
              <p className="text-gray-500">
                {item.variantName ? `${item.variantName} · ` : ''}Qty {item.quantity}
              </p>
            </div>
            <span className="font-semibold text-gray-900">{money(item.total)}</span>
          </li>
        ))}
      </ul>

      <dl className="p-6 bg-gray-50 space-y-2 text-sm">
        <div className="flex justify-between"><dt className="text-gray-600">Subtotal</dt><dd>{money(order.subtotal)}</dd></div>
        <div className="flex justify-between">
          <dt className="text-gray-600">Delivery</dt>
          <dd>{Number(order.delivery_price) === 0 ? 'FREE' : money(order.delivery_price)}</dd>
        </div>
        <div className="flex justify-between text-gray-500"><dt>Includes VAT</dt><dd>{money(order.tax)}</dd></div>
        <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200">
          <dt>Total</dt><dd>{money(order.total)}</dd>
        </div>
      </dl>
    </div>
  );
}
