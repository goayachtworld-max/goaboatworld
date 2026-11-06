import type { Metadata } from 'next';
import type React from 'react';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Goaboatworld collects, uses and protects your personal information when you book yacht experiences in Goa.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
