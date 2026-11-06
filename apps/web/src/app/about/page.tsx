import React from 'react';
import Link from 'next/link';
import { Shield, Heart, Award, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Goaboatworld is Goa’s premium private yacht company — curated charters, sunset cruises and celebrations on the water, sailing from Panjim Jetty.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Us | Goaboatworld',
    description: 'Goa’s premium private yacht company — curated charters and celebrations on the water.',
    url: '/about',
  },
};

export default function AboutPage() {
  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 mb-32">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[#1A3C35] text-[14px] font-medium transition-colors group mb-8"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>
      </div>

      {/* --- VISION --- */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <p className="text-[#3D9B7D] font-bold uppercase tracking-widest text-xs">Our Story</p>
            <h1 className="text-4xl md:text-6xl font-playfair-display font-bold text-[#1A3C35]">
              Goa, Seen From a Different Perspective.
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed">
              Goaboatworld was founded with a simple vision: to make the beauty and luxury of private
              sailing accessible to everyone visiting Goa. We believe that the water offers a sense
              of peace and celebration that you just can't find on land.
            </p>
            <p className="text-gray-500 text-lg leading-relaxed">
              Our mission is to provide high-quality, safe, and memorable yacht experiences curated
              for celebrations, reconnections, and discoveries. Whether you're a couple looking for
              a romantic sunset or a large group celebrating a milestone, we treat every booking
              with the same level of care and attention to detail.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="/uploads/about-yacht-view.jpg"
              className="w-full h-80 object-cover mt-12 shadow-lg"
              alt="Yacht View"
            />
            <img
              src="/uploads/about-yacht-interior.jpg"
              className="w-full h-80 object-cover shadow-lg"
              alt="Yacht Interior"
            />
          </div>
        </div>
      </section>

      {/* --- VALUES --- */}
      <section className="bg-[#F0F4F2] py-24 px-6 border-y border-[#D0E8DF]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-playfair-display font-bold text-[#1A3C35] mb-6">
              What We Stand For
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Our core values guide every experience we create and every interaction we have with
              our guests.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Safety & Trust',
                desc: 'Your safety is our top priority. All our yachts are maintained to high standards and operated by professional crew.',
              },
              {
                icon: <Heart className="w-8 h-8" />,
                title: 'Personalized Service',
                desc: 'No two sailings are the same. We tailor every aspect to your specific needs and preferences.',
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: 'Premium Quality',
                desc: 'From the yachts we select to the refreshments we serve, we focus on providing a high-quality experience.',
              },
            ].map((value, i) => (
              <div
                key={i}
                className="bg-white p-12 text-center space-y-6 shadow-sm border border-[#D0E8DF]"
              >
                <div className="w-16 h-16 bg-[#1A3C35] text-white flex items-center justify-center mx-auto">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-playfair-display font-bold text-[#1A3C35]">
                  {value.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- STATS --- */}
      <section className="py-32 px-6 max-w-7xl mx-auto text-center">
        <div className="flex flex-wrap justify-center gap-16 md:gap-32">
          {[
            { label: 'Happy Guests', value: '5000+' },
            { label: 'Luxury Yachts', value: '10+' },
            { label: 'Successful Events', value: '1200+' },
            { label: 'Years in Goa', value: '5+' },
          ].map((stat, i) => (
            <div key={i} className="space-y-2">
              <p className="text-5xl md:text-6xl font-playfair-display font-bold text-[#2A6655]">
                {stat.value}
              </p>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="bg-[#1A3C35] py-24 px-6 text-center text-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-playfair-display font-bold mb-8">
            Ready to Start Your Journey?
          </h2>
          <p className="text-white/60 mb-12 text-lg">
            Whether it's your first time or you're a regular, we're here to help you find the
            perfect sailing experience.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-[#3D9B7D] hover:bg-[#2A6655] text-white rounded-sm px-10"
            >
              <Link href="/fleet">View Our Fleet</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white hover:text-[#1A3C35] rounded-sm px-10"
            >
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
