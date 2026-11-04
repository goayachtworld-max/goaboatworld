'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Experience {
  id: number;
  title: string;
  description: string;
  images: string[];
  is_active: boolean;
  sort_order: number;
}

export default function ExperiencesSection() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/experiences')
      .then((res) => res.json())
      .then((data) => {
        setExperiences(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (experiences.length === 0) return null;

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <p className="text-[#3D9B7D] font-bold uppercase tracking-widest text-xs mb-4">
          Curated Moments
        </p>
        <h2 className="text-4xl md:text-6xl font-playfair-display font-bold text-[#1A3C35] mb-6">
          Unforgettable Experiences
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
          From romantic sunsets to high-energy celebrations, we curate every detail
          to make your journey on the water truly special.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {experiences.map((exp, i) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100 cursor-pointer"
          >
            {/* Image */}
            <motion.img
              src={exp.images?.[0] || ''}
              alt={exp.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A3C35]/90 via-[#1A3C35]/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

            {/* Content */}
            <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
              <h3 className="text-2xl md:text-3xl font-playfair-display font-bold mb-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                {exp.title}
              </h3>
              <p className="text-white/70 text-sm leading-relaxed opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100 mb-6">
                {exp.description}
              </p>
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 delay-200 translate-y-4 group-hover:translate-y-0">
                Explore <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <Link
          href="/contact"
          className="inline-flex items-center justify-center gap-2 bg-[#1A3C35] hover:bg-[#2A6655] text-white px-10 py-4 rounded-xl font-bold transition-all hover:shadow-xl active:scale-95"
        >
          Plan Your Experience <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
