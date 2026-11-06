import type { Metadata } from 'next';
import type React from 'react';

// Sign-in / sign-up utility pages are not search content.
export const metadata: Metadata = {
  title: 'Account',
  robots: { index: false, follow: false },
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return children;
}
