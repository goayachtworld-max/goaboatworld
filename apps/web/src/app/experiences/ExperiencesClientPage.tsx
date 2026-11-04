'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface ExpItem {
  id: number;
  title: string;
  description: string;
  images: string[];
  emoji?: string;
}

const DEFAULT_ITEMS: ExpItem[] = [
  {
    id: 1,
    title: 'Birthday Celebrations',
    description:
      'Celebrate another year surrounded by the sea, your favourite people, and unforgettable views. Let the open water be the backdrop to your most memorable birthday yet.',
    images: [
      'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=1973&auto=format&fit=crop',
    ],
    emoji: '🎂',
  },
  {
    id: 2,
    title: 'Sunset Cruises',
    description:
      "Slow down and enjoy Goa's beautiful waters as the sky turns golden. There is no better place to watch the sun set than from the deck of a private yacht.",
    images: [
      'https://images.unsplash.com/photo-1534313314376-a72289b6181e?q=80&w=1974&auto=format&fit=crop',
    ],
    emoji: '🌅',
  },
  {
    id: 3,
    title: 'Couple Experiences',
    description:
      "A private escape designed for romance, from quiet cruises to special celebrations. Whether it's a proposal, anniversary, or simply a date to remember — we make it perfect.",
    images: [
      'https://images.unsplash.com/photo-1516589174184-c68d8e5ffe5e?q=80&w=1974&auto=format&fit=crop',
    ],
    emoji: '💑',
  },
  {
    id: 4,
    title: 'Corporate Events',
    description:
      'Take your team meetings or networking out to sea for a fresh perspective. A yacht changes the dynamic — ideas flow, bonds form, and the experience becomes unforgettable.',
    images: [
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084&auto=format&fit=crop',
    ],
    emoji: '💼',
  },
];

export default function ExperiencesPage() {
  const [items, setItems] = useState<ExpItem[]>(DEFAULT_ITEMS);
  const [heading, setHeading] = useState("More Than a Cruise. It's Your Moment.");
  const [subheading, setSubheading] = useState(
    "Whether it's a quiet sunset or a grand celebration, we curate every detail to ensure your time on the Goa waters is nothing short of extraordinary."
  );

  useEffect(() => {
    // Fetch headings from site-config
    fetch('/api/site-config')
      .then((r) => (r.ok ? r.json() : {}))
      .then((cfg: Record<string, string>) => {
        if (cfg.experiences_section_heading) setHeading(cfg.experiences_section_heading);
        if (cfg.experiences_section_subheading) setSubheading(cfg.experiences_section_subheading);
      })
      .catch(() => {});

    // Fetch experiences from the new API
    fetch('/api/experiences')
      .then((r) => (r.ok ? r.json() : []))
      .then((data: ExpItem[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setItems(data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="pt-28 pb-24 bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[#3D9B7D] font-bold uppercase tracking-widest text-[11px] mb-4">
            Our Experiences
          </p>
          <h1 className="text-4xl md:text-5xl font-playfair-display font-bold text-[#1A3C35] mb-5 leading-tight">
            {heading}
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-[15px] leading-relaxed">
            {subheading}
          </p>
        </div>

        {/* Experience Cards */}
        <div className="space-y-20">
          {items.map((exp, i) => (
            <div
              key={exp.id}
              className={`flex flex-col md:flex-row gap-10 items-center ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
            >
              {/* Image */}
              <div
                className="w-full md:w-1/2 relative overflow-hidden rounded-2xl shadow-xl group"
                style={{ height: '360px' }}
              >
                <img
                  src={exp.images?.[0] || ''}
                  alt={exp.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A3C35]/30 via-transparent to-transparent" />
                {exp.emoji && (
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 text-[22px] shadow-lg">
                    {exp.emoji}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="w-full md:w-1/2">
                <p className="text-[#3D9B7D] font-bold uppercase tracking-widest text-[11px] mb-3">
                  {String(i + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
                </p>
                <h2 className="text-3xl font-playfair-display font-bold text-[#1A3C35] mb-4">
                  {exp.title}
                </h2>
                <p className="text-gray-500 text-[15px] mb-8 leading-relaxed">{exp.description}</p>
                <div className="flex gap-3 flex-wrap">
                  <Button
                    asChild
                    className="bg-[#3D9B7D] hover:bg-[#2A6655] text-white rounded-full px-7 bms-btn-press"
                  >
                    <Link href="/contact">
                      Enquire Now <ArrowRight className="w-4 h-4 ml-1 inline" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-[#1A3C35]/30 text-[#1A3C35] hover:bg-[#1A3C35] hover:text-white rounded-full px-7 bms-btn-press"
                  >
                    <Link href="/fleet">View Yachts</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Experience CTA */}
        <div className="mt-24 bg-[#1A3C35] rounded-3xl p-10 md:p-16 text-center text-white">
          <p className="text-[#3D9B7D] font-bold uppercase tracking-widest text-[11px] mb-4">
            Custom Experiences
          </p>
          <h2 className="text-3xl md:text-4xl font-playfair-display font-bold mb-5">
            Have Something Special in Mind?
          </h2>
          <p className="text-white/60 max-w-xl mx-auto mb-10 text-[15px] leading-relaxed">
            From pre-wedding shoots to private dinners and corporate retreats, we can customize
            every aspect of your sailing experience.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-[#3D9B7D] hover:bg-[#2A6655] text-white rounded-full px-10 h-13 text-[15px] font-semibold bms-btn-press"
          >
            <Link href="/contact">
              Let&apos;s Plan It Together <ArrowRight className="w-4 h-4 ml-2 inline" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
