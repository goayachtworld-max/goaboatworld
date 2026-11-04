'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Camera, ChevronDown, X, CalendarDays } from 'lucide-react';

interface GalleryPhoto {
  id: number;
  image_url: string;
  caption: string;
  trip_date: string | null;
  yacht_name: string;
  category: string;
  created_at: string;
}

const PAGE_SIZE = 12;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDate(d: string | null): string {
  if (!d) return '';
  // Parse YYYY-MM-DD without using new Date() to avoid timezone issues
  const parts = d.substring(0, 10).split('-');
  if (parts.length !== 3) return d;
  const [year, month, day] = parts;
  const monthName = MONTHS[parseInt(month, 10) - 1] || month;
  return `${parseInt(day, 10)} ${monthName} ${year}`;
}

// Staggered masonry-style sizes — cycles through 12 patterns
const CARD_SIZES = [
  'md:col-span-2 md:row-span-2', // big square
  'md:col-span-1 md:row-span-1', // small
  'md:col-span-1 md:row-span-1', // small
  'md:col-span-1 md:row-span-2', // tall
  'md:col-span-2 md:row-span-1', // wide
  'md:col-span-1 md:row-span-1', // small
  'md:col-span-1 md:row-span-1', // small
  'md:col-span-1 md:row-span-1', // small
  'md:col-span-2 md:row-span-1', // wide
  'md:col-span-1 md:row-span-2', // tall
  'md:col-span-1 md:row-span-1', // small
  'md:col-span-1 md:row-span-1', // small
];

const CAT_EMOJI: Record<string, string> = {
  'Birthday Party': '🎂',
  'Sunset Cruise': '🌅',
  'Couple Experience': '💑',
  'Corporate Event': '💼',
  Proposal: '💍',
  'Friends Outing': '🎉',
  Anniversary: '❤️',
  'Family Trip': '👨‍👩‍👧',
};

/* ── Photo Card ──────────────────────────────────────────────── */
function PhotoCard({
  photo,
  size,
  onOpen,
}: {
  photo: GalleryPhoto;
  size: string;
  onOpen: () => void;
}) {
  const emoji = CAT_EMOJI[photo.category] || '📸';
  const dateStr = formatDate(photo.trip_date);
  return (
    <div
      className={`${size} relative group overflow-hidden rounded-2xl cursor-pointer bg-gray-100`}
      onClick={onOpen}
      style={{ minHeight: '180px' }}
    >
      <img
        src={photo.image_url}
        alt={photo.caption || photo.category}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />

      {/* Category badge — always visible */}
      {photo.category && (
        <div className="absolute top-3 left-3 bg-[#1A3C35]/80 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
          <span>{emoji}</span>
          <span className="hidden sm:inline">{photo.category}</span>
        </div>
      )}

      {/* Bottom info — slides up on hover */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/75 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        {photo.caption && (
          <p className="text-white font-semibold text-[13px] mb-1 line-clamp-1">{photo.caption}</p>
        )}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {photo.yacht_name && (
            <span className="text-white/80 text-[11px] font-medium">⛵ {photo.yacht_name}</span>
          )}
          {dateStr && (
            <span className="text-white/60 text-[11px] flex items-center gap-1">
              <CalendarDays className="w-3 h-3" />
              {dateStr}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Lightbox ────────────────────────────────────────────────── */
function Lightbox({
  photo,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: {
  photo: GalleryPhoto;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}) {
  const emoji = CAT_EMOJI[photo.category] || '📸';
  const dateStr = formatDate(photo.trip_date);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && hasNext) onNext();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
    };
    window.addEventListener('keydown', h);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', h);
      document.body.style.overflow = '';
    };
  }, [onClose, onNext, onPrev, hasNext, hasPrev]);

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 w-10 h-10 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center text-white z-10 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Prev */}
      {hasPrev && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center text-white text-2xl z-10 transition-colors"
        >
          ‹
        </button>
      )}

      {/* Image */}
      <div className="relative max-w-4xl max-h-[90vh] mx-16" onClick={(e) => e.stopPropagation()}>
        <img
          src={photo.image_url}
          alt={photo.caption || ''}
          className="max-h-[78vh] max-w-full rounded-xl object-contain shadow-2xl"
        />
        {/* Meta under image */}
        <div className="mt-4 text-center px-4">
          {photo.caption && (
            <p className="text-white font-semibold text-[15px] mb-2">{photo.caption}</p>
          )}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {photo.category && (
              <span className="text-white/60 text-[13px]">
                {emoji} {photo.category}
              </span>
            )}
            {photo.yacht_name && (
              <span className="text-white/60 text-[13px]">⛵ {photo.yacht_name}</span>
            )}
            {dateStr && <span className="text-white/60 text-[13px]">📅 {dateStr}</span>}
          </div>
        </div>
      </div>

      {/* Next */}
      {hasNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center text-white text-2xl z-10 transition-colors"
        >
          ›
        </button>
      )}
    </div>
  );
}

/* ── Main Gallery Page ───────────────────────────────────────── */
export default function GalleryPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [yachts, setYachts] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedYacht, setSelectedYacht] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  // Fetch filter options
  const fetchFilters = useCallback(async () => {
    try {
      const res = await fetch('/api/gallery', { method: 'PATCH' });
      if (!res.ok) return;
      const data = await res.json();
      setYachts(data.yachts || []);
      setCategories(data.categories || []);
    } catch {
      /* silent */
    }
  }, []);

  // Fetch photos
  const fetchPhotos = useCallback(
    async (reset: boolean, yacht: string, cat: string, prevOffset: number) => {
      const off = reset ? 0 : prevOffset;
      if (reset) setLoading(true);
      else setLoadingMore(true);
      try {
        const params = new URLSearchParams({ limit: String(PAGE_SIZE), offset: String(off) });
        if (yacht) params.set('yacht', yacht);
        if (cat) params.set('category', cat);
        const res = await fetch(`/api/gallery?${params}`);
        if (!res.ok) return;
        const data: GalleryPhoto[] = await res.json();
        setPhotos((prev) => (reset ? data : [...prev, ...data]));
        setCurrentOffset(off + PAGE_SIZE);
        setHasMore(data.length === PAGE_SIZE);
      } catch {
        /* silent */
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchFilters();
    fetchPhotos(true, '', '', 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyFilter = (yacht: string, cat: string) => {
    setSelectedYacht(yacht);
    setSelectedCategory(cat);
    fetchPhotos(true, yacht, cat, 0);
  };

  const handleLoadMore = () => {
    fetchPhotos(false, selectedYacht, selectedCategory, currentOffset);
  };

  const isFiltered = selectedYacht !== '' || selectedCategory !== '';

  return (
    <div className="min-h-screen bg-[#F8FAFA] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* ── Header ── */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#E8F5F0] text-[#2A6655] rounded-full px-5 py-2 text-[12px] font-bold uppercase tracking-widest mb-5">
            <Camera className="w-3.5 h-3.5" /> Real Trips · Real Guests
          </div>
          <h1 className="text-4xl md:text-5xl font-playfair-display font-bold text-[#1A3C35] mb-4">
            Gallery
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto text-[15px] leading-relaxed">
            A peek into every celebration, cruise, and adventure our guests have experienced on the
            waters of Goa.
          </p>
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-wrap items-center gap-2.5 mb-10 justify-center">
          {/* All photos */}
          <button
            onClick={() => applyFilter('', '')}
            className={`px-5 py-2.5 rounded-full text-[13px] font-bold border-2 transition-all ${!isFiltered ? 'bg-[#1A3C35] text-white border-[#1A3C35] shadow-md' : 'border-gray-200 text-gray-500 hover:border-[#3D9B7D] hover:text-[#3D9B7D] bg-white'}`}
          >
            All Photos
          </button>

          {/* Separator */}
          {yachts.length > 0 && <div className="w-px h-6 bg-gray-200 hidden sm:block" />}

          {/* Yacht dropdown */}
          {yachts.length > 0 && (
            <div className="relative">
              <select
                value={selectedYacht}
                onChange={(e) => applyFilter(e.target.value, selectedCategory)}
                className={`appearance-none border-2 text-[13px] font-bold rounded-full pl-4 pr-9 py-2.5 cursor-pointer focus:outline-none transition-all ${selectedYacht ? 'bg-[#1A3C35] text-white border-[#1A3C35]' : 'bg-white border-gray-200 text-gray-500 hover:border-[#3D9B7D]'}`}
              >
                <option value="">⛵ By Yacht</option>
                {yachts.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <ChevronDown
                className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${selectedYacht ? 'text-white' : 'text-gray-400'}`}
              />
            </div>
          )}

          {/* Category pills */}
          {categories.length > 0 && <div className="w-px h-6 bg-gray-200 hidden sm:block" />}
          {categories.map((cat) => {
            const emoji = CAT_EMOJI[cat] || '📸';
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => applyFilter(selectedYacht, active ? '' : cat)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-[13px] font-bold border-2 transition-all ${active ? 'bg-[#3D9B7D] text-white border-[#3D9B7D] shadow-md' : 'border-gray-200 text-gray-500 hover:border-[#3D9B7D] hover:text-[#3D9B7D] bg-white'}`}
              >
                <span>{emoji}</span>
                <span>{cat}</span>
              </button>
            );
          })}

          {/* Clear */}
          {isFiltered && (
            <button
              onClick={() => applyFilter('', '')}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-[13px] font-bold text-red-400 hover:text-red-600 border-2 border-red-100 hover:border-red-300 bg-white transition-all"
            >
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>

        {/* ── Count ── */}
        {!loading && photos.length > 0 && (
          <p className="text-center text-[12px] text-gray-400 mb-8 font-medium tracking-wide uppercase">
            Showing {photos.length}
            {hasMore ? '+' : ''} photos
            {selectedYacht && ` · ${selectedYacht}`}
            {selectedCategory && ` · ${CAT_EMOJI[selectedCategory] || ''} ${selectedCategory}`}
          </p>
        )}

        {/* ── Loading skeleton ── */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] md:auto-rows-[200px] gap-3 md:gap-4">
            {[...Array(8)].map((_, i) => {
              const size = CARD_SIZES[i % CARD_SIZES.length];
              return (
                <div
                  key={i}
                  className={`${size} bg-gray-200 rounded-2xl`}
                  style={{ animation: `pulse 1.5s ease-in-out ${i * 0.1}s infinite` }}
                />
              );
            })}
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && photos.length === 0 && (
          <div className="text-center py-24 text-gray-400">
            <p className="text-6xl mb-5">📷</p>
            <p className="font-bold text-[18px] text-[#1A3C35] mb-2">
              No photos for this filter yet.
            </p>
            <p className="text-[14px] mb-6">Try a different yacht or category.</p>
            <button
              onClick={() => applyFilter('', '')}
              className="bg-[#3D9B7D] text-white rounded-full px-8 py-3 font-bold text-[14px] hover:bg-[#2A6655] transition-colors"
            >
              Show All Photos
            </button>
          </div>
        )}

        {/* ── Masonry grid ── */}
        {!loading && photos.length > 0 && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] md:auto-rows-[200px] gap-3 md:gap-4">
              {photos.map((photo, i) => {
                const size = CARD_SIZES[i % CARD_SIZES.length];
                return (
                  <PhotoCard
                    key={photo.id}
                    photo={photo}
                    size={size}
                    onOpen={() => setLightboxIdx(i)}
                  />
                );
              })}
            </div>

            {/* Load More button */}
            {hasMore && (
              <div className="flex justify-center mt-14">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="flex items-center gap-3 bg-[#1A3C35] hover:bg-[#2A6655] text-white rounded-full px-10 py-4 text-[14px] font-bold shadow-md transition-all disabled:opacity-60"
                >
                  {loadingMore ? (
                    <span className="bms-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                  {loadingMore ? 'Loading more...' : 'Load More Photos'}
                </button>
              </div>
            )}

            {!hasMore && photos.length >= PAGE_SIZE && (
              <p className="text-center text-gray-400 text-[13px] mt-12 font-medium">
                You've seen all {photos.length} photos · More trips coming soon! 📸
              </p>
            )}
          </>
        )}
      </div>

      {/* ── Lightbox ── */}
      {lightboxIdx !== null && (
        <Lightbox
          photo={photos[lightboxIdx]}
          onClose={() => setLightboxIdx(null)}
          onPrev={() => setLightboxIdx((i) => (i !== null ? Math.max(0, i - 1) : null))}
          onNext={() =>
            setLightboxIdx((i) => (i !== null ? Math.min(photos.length - 1, i + 1) : null))
          }
          hasPrev={lightboxIdx > 0}
          hasNext={lightboxIdx < photos.length - 1}
        />
      )}

      <style jsx global>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }
        .bms-spin {
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
