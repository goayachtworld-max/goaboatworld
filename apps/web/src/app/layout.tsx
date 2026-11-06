import type { Metadata, Viewport } from 'next';
import type React from 'react';
import './global.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import BackToTop from '@/components/BackToTop';
import { Providers } from '@/app/providers';
import LoadingScreen from '@/components/LoadingScreen';

export const viewport: Viewport = {
  themeColor: "#1A3C35",
};

export const metadata: Metadata = {
  title: 'Goaboatworld | Private Yacht Experiences & Boat Charters in Goa',
  description:
    'Discover private yacht experiences in Goa with Goaboatworld. Explore yachts, sunset cruises, celebrations, and customized boat charter experiences.',
  keywords: ["yacht rental goa", "private boat goa", "luxury cruises", "boat charter goa"],
  icons: {
    other: [{ rel: "mask-icon", url: "/mask-icon.svg", color: "#1A3C35" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-manrope antialiased bg-white text-[#17212B]">
        <Providers>
          <LoadingScreen>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <BackToTop />
            <FloatingWhatsApp />
          </LoadingScreen>
        </Providers>
      </body>
    </html>
  );
}
