import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Repairs',
  description: 'Book a phone, tablet or laptop repair with FixToday, and track it online from check-in to collection.',
};

export default function RepairsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
