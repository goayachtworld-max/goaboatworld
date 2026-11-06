import type { Metadata } from 'next';
import type React from 'react';

export const metadata: Metadata = {
  title: 'Cancellation & Refund Policy',
  description:
    'Cancellation and refund terms for Goaboatworld yacht bookings — full refunds 10+ days ahead, partial refunds up to 5 days before sailing.',
  alternates: { canonical: '/cancellation-refund' },
};

export default function CancellationRefundLayout({ children }: { children: React.ReactNode }) {
  return children;
}
