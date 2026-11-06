import type { Metadata, Viewport } from 'next';
import type React from 'react';
import './global.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import BackToTop from '@/components/BackToTop';
import { Providers } from '@/app/providers';
import LoadingScreen from '@/components/LoadingScreen';

export const SITE_URL = 'https://www.goaboatworld.com';
const OG_IMAGE = '/uploads/1793782715325-8gqbc4k.jpg';

export const viewport: Viewport = {
  themeColor: '#1A3C35',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Goaboatworld | Private Yacht Experiences & Boat Charters in Goa',
    template: '%s | Goaboatworld',
  },
  description:
    'Book private yachts, sunset cruises and luxury boat charters in Goa with Goaboatworld. Curated experiences for birthdays, proposals, corporate events and celebrations on the water.',
  keywords: [
    'yacht rental goa',
    'yacht charter goa',
    'private boat goa',
    'luxury cruises goa',
    'boat charter goa',
    'sunset cruise goa',
    'yacht party goa',
    'private yacht booking goa',
  ],
  applicationName: 'Goaboatworld',
  authors: [{ name: 'Goaboatworld', url: SITE_URL }],
  creator: 'Goaboatworld',
  publisher: 'Goaboatworld',
  category: 'travel',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: 'Goaboatworld',
    title: 'Goaboatworld | Private Yacht Experiences & Boat Charters in Goa',
    description:
      'Book private yachts, sunset cruises and luxury boat charters in Goa. Curated experiences for birthdays, proposals and celebrations on the water.',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Private yacht cruising off the Goa coast at sunset',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Goaboatworld | Private Yacht Experiences in Goa',
    description:
      'Book private yachts, sunset cruises and luxury boat charters in Goa — curated celebrations on the water.',
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    other: [{ rel: 'mask-icon', url: '/mask-icon.svg', color: '#1A3C35' }],
  },
};

const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['LocalBusiness', 'TravelAgency'],
      '@id': `${SITE_URL}/#business`,
      name: 'Goaboatworld',
      description:
        'Private yacht experiences and boat charters in Goa — sunset cruises, celebrations, proposals, corporate events and luxury sailing.',
      url: SITE_URL,
      image: `${SITE_URL}${OG_IMAGE}`,
      telephone: '+918446225985',
      email: 'goaboatworld@gmail.com',
      priceRange: '₹₹₹',
      currenciesAccepted: 'INR',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Panjim Jetty',
        addressLocality: 'Panjim',
        addressRegion: 'Goa',
        addressCountry: 'IN',
      },
      geo: { '@type': 'GeoCoordinates', latitude: 15.4967, longitude: 73.8267 },
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '09:00',
        closes: '20:00',
      },
      sameAs: [
        'https://instagram.com/Goaboatworld',
        'https://facebook.com/Goaboatworld',
        'https://youtube.com/Goaboatworld',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'Goaboatworld',
      publisher: { '@id': `${SITE_URL}/#business` },
      inLanguage: 'en-IN',
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-manrope antialiased bg-white text-[#17212B]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
        />
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
