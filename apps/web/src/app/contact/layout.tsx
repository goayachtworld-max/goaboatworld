import type { Metadata } from 'next';
import type React from 'react';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Goaboatworld to plan your private yacht experience in Goa — call, WhatsApp or email us. Open every day, 9 AM to 8 PM, at Panjim Jetty.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Us | Goaboatworld',
    description:
      'Plan your private yacht experience in Goa — call, WhatsApp or email Goaboatworld.',
    url: '/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
