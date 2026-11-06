import type { Metadata } from 'next';
import type React from 'react';

export const metadata: Metadata = {
  title: 'Gallery',
  description:
    'Moments from real Goaboatworld trips — sunsets, celebrations and life aboard our private yachts in Goa.',
  alternates: { canonical: '/gallery' },
  openGraph: {
    title: 'Gallery | Goaboatworld',
    description: 'Real moments aboard Goaboatworld private yachts in Goa.',
    url: '/gallery',
  },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
