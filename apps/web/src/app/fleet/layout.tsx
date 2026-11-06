import type { Metadata } from 'next';
import type React from 'react';

export const metadata: Metadata = {
  title: 'Our Yacht Fleet in Goa',
  description:
    'Explore the Goaboatworld fleet — luxury yachts, speed boats and cruisers available for private charter in Goa. Compare capacity, pricing and packages.',
  alternates: { canonical: '/fleet' },
  openGraph: {
    title: 'Our Yacht Fleet in Goa | Goaboatworld',
    description:
      'Luxury yachts, speed boats and cruisers available for private charter in Goa.',
    url: '/fleet',
  },
};

export default function FleetLayout({ children }: { children: React.ReactNode }) {
  return children;
}
