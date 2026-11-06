import type { Metadata } from 'next';
import type React from 'react';

// Admin pages must never appear in search results.
export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
