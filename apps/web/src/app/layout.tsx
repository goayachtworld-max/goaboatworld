import type { Metadata } from 'next';
import type React from 'react';
import './global.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import BackToTop from '@/components/BackToTop';
import { Providers } from '@/app/providers';

export const metadata: Metadata = {
  title: 'Goaboatworld | Private Yacht Experiences & Boat Charters in Goa',
  description:
    'Discover private yacht experiences in Goa with Goaboatworld. Explore yachts, sunset cruises, celebrations, and customized boat charter experiences.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-manrope antialiased bg-white text-[#17212B]">
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <BackToTop />
          <FloatingWhatsApp />
        </Providers>
      </body>
    </html>
  );
}
