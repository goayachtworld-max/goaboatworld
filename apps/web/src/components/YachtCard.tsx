'use client';

import React from 'react';
import Link from 'next/link';
import { Users, ArrowRight, ImageIcon } from 'lucide-react';
import { Yacht } from '@/data/yachts';
import { motion } from 'motion/react';

const WHATSAPP_NUMBER = '919876543210';

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

interface YachtCardProps {
  yacht: Yacht;
}

const YachtCard = ({ yacht }: YachtCardProps) => {
  const whatsappMessage = encodeURIComponent(
    `Hi Goaboatworld! 👋\n\nI'm interested in the *${yacht.name}*.\n\nCould you please share more details about availability and pricing?\n\nThank you!`
  );
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;
  const firstTier = yacht.priceTiers[0];

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(26,60,53,0.15)] transition-all duration-500"
    >
      {/* ── IMAGE (clicking image goes to detail page) ── */}
      <Link
        href={`/yacht/${yacht.id}`}
        className="block relative overflow-hidden"
        style={{ height: '220px' }}
      >
        <img
          src={yacht.images[0]}
          alt={`${yacht.name} - Luxury Yacht Rental in Goa`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* TOP-LEFT: photo count */}
        {yacht.photoCount && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-[#1A3C35] text-[12px] font-semibold px-3 py-1.5 rounded-full shadow-sm">
            <ImageIcon className="w-3.5 h-3.5" />
            {yacht.photoCount}+ Photos
          </div>
        )}

        {/* BOTTOM-LEFT: promoLabel (Free Drone, Free DJ, etc.) */}
        {yacht.promoLabel && (
          <div className="absolute bottom-3 left-3 bg-[#3D9B7D] text-white text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wide shadow-sm">
            🎁 {yacht.promoLabel}
          </div>
        )}
      </Link>

      {/* ── CONTENT ── */}
      <div className="p-5">
        {/* Yacht name and Guest capacity */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <Link href={`/yacht/${yacht.id}`}>
            <h3 className="text-[20px] font-playfair-display font-bold text-[#1A3C35] leading-snug hover:text-[#3D9B7D] transition-colors">
              {yacht.name}
            </h3>
          </Link>
          <div className="inline-flex items-center gap-1.5 bg-[#F0F4F2] text-[#1A3C35] text-[11px] font-semibold px-2 py-1 rounded-full shrink-0">
            <Users className="w-3 h-3 text-[#3D9B7D]" />
            Upto {yacht.capacity} Guests
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-400 text-[13px] leading-relaxed line-clamp-2 mb-4">
          {yacht.description}
        </p>

        {/* Divider */}
        <div className="h-px bg-gray-100 mb-4" />

        {/* Price row + action buttons */}
        <div className="flex items-end justify-between gap-2">
          {/* Clean price — no strikethrough */}
          <div>
            <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide mb-0.5">
              Starting from
            </p>
            <p className="text-[24px] font-bold text-[#1A3C35] leading-none">{firstTier.price}</p>
            <p className="text-[12px] text-gray-400 font-medium mt-0.5">/Hour</p>
          </div>

          {/* Round action buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Enquire on WhatsApp"
              className="w-11 h-11 rounded-full bg-[#25D366] hover:bg-[#1db954] text-white flex items-center justify-center shadow-md hover:shadow-lg hover:scale-110 transition-all duration-300"
            >
              <WhatsAppIcon />
            </a>
            <Link
              href={`/yacht/${yacht.id}`}
              aria-label="View Details"
              className="w-11 h-11 rounded-full bg-[#1A3C35] hover:bg-[#3D9B7D] text-white flex items-center justify-center shadow-md hover:shadow-lg hover:scale-110 transition-all duration-300"
            >
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default YachtCard;
