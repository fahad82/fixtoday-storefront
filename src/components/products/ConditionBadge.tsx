// Shows whether a product is new, refurbished or used, and what that means.
import { FaBatteryThreeQuarters, FaClipboardCheck, FaShieldAlt, FaStar } from 'react-icons/fa';
import type { Product, ProductCondition } from '../../types';

export const CONDITION_LABELS: Record<ProductCondition, string> = {
  new: 'New',
  refurbished: 'Refurbished',
  used: 'Used',
};

export const GRADE_LABELS: Record<string, { label: string; text: string }> = {
  pristine: { label: 'Pristine', text: 'Looks as good as new. No visible marks.' },
  excellent: { label: 'Excellent', text: 'Very light signs of use, only visible up close.' },
  very_good: { label: 'Very good', text: 'Light scratches or scuffs that are visible at arm’s length.' },
  good: { label: 'Good', text: 'Visible signs of use such as scratches or small dents. Works perfectly.' },
};

const TONE: Record<ProductCondition, string> = {
  new: 'bg-blue-600 text-white',
  refurbished: 'bg-emerald-600 text-white',
  used: 'bg-amber-500 text-white',
};

type ConditionFields = Pick<Product, 'condition' | 'condition_grade' | 'battery_health' | 'warranty_months'>;

/** Small pill for product cards. Shows nothing for new stock. */
export function ConditionBadge({ product }: { product: Partial<ConditionFields> }) {
  const condition = product.condition || 'new';
  if (condition === 'new') return null;
  const grade = product.condition_grade ? GRADE_LABELS[product.condition_grade]?.label : null;
  return (
    <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-lg ${TONE[condition]}`}>
      {CONDITION_LABELS[condition]}{grade ? ` · ${grade}` : ''}
    </span>
  );
}

/** Panel for the product page: grade, battery, warranty and checks. */
export function ConditionDetails({ product }: { product: Partial<ConditionFields> }) {
  const condition = product.condition || 'new';
  const grade = product.condition_grade ? GRADE_LABELS[product.condition_grade] : null;
  const warranty = product.warranty_months ?? (condition === 'new' ? null : 12);
  if (condition === 'new' && !product.warranty_months) return null;

  return (
    <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${TONE[condition]}`}>{CONDITION_LABELS[condition]}</span>
        {grade && <span className="text-sm font-semibold text-gray-900">Grade: {grade.label}</span>}
      </div>
      <ul className="grid sm:grid-cols-2 gap-2 text-sm text-gray-700">
        {grade && (
          <li className="flex gap-2"><FaStar className="text-emerald-600 mt-0.5 shrink-0" /><span>{grade.text}</span></li>
        )}
        {product.battery_health != null && (
          <li className="flex gap-2">
            <FaBatteryThreeQuarters className="text-emerald-600 mt-0.5 shrink-0" />
            <span>Battery health {product.battery_health}%</span>
          </li>
        )}
        {condition !== 'new' && (
          <li className="flex gap-2">
            <FaClipboardCheck className="text-emerald-600 mt-0.5 shrink-0" />
            <span>Fully tested by our technicians and data wiped</span>
          </li>
        )}
        {warranty != null && warranty > 0 && (
          <li className="flex gap-2">
            <FaShieldAlt className="text-emerald-600 mt-0.5 shrink-0" />
            <span>{warranty}-month warranty</span>
          </li>
        )}
      </ul>
    </div>
  );
}
