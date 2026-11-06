import type { Metadata } from 'next';
import type React from 'react';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and conditions for booking private yacht experiences with Goaboatworld in Goa.',
  alternates: { canonical: '/terms' },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
