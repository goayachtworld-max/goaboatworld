'use client';

import React, { useEffect, useState, useMemo, useRef, Suspense } from 'react';
import YachtCard from '@/components/YachtCard';
import { type Yacht } from '@/data/yachts';
import Link from 'next/link';
import { MessageCircle, Phone, SlidersHorizontal, X, Users, IndianRupee } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import AnimatedSection from '@/components/AnimatedSection';

/* ── DB shape ─────────────────────────────────────────────────── */
interface DBYacht {
  id: string;
  name: string;
  description: string;
  type: string;
  capacity: number;
  sailing_price: number;
  sailing_price_2hr: number;
  banner_image: string;
  images: unknown;
  promo_label: string;
  is_active: boolean;
  sort_order: number;
}

function parseImgs(v: unknown): string[] {
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') {
    try {
      return JSON.parse(v);
    } catch {
      return [];
    }
  }
  return [];
}

function dbToCard(y: DBYacht): Yacht {
  const imgs = parseImgs(y.images);
  const all = y.banner_image ? [y.banner_image, ...imgs.filter((u) => u !== y.banner_image)] : imgs;
  const unique = Array.from(new Set(all));
  return {
    id: y.id,
    name: y.name,
    type: y.type,
    capacity: y.capacity,
    duration: '1–4 Hours',
    description: y.description,
    price: '₹' + y.sailing_price.toLocaleString('en-IN'),
    rawPrice: y.sailing_price,
    promoLabel: y.promo_label || undefined,
    photoCount: unique.length,
    priceTiers: [
      {
        label: '1 HOUR TRIP',
        duration: '1 Hr',
        price: '₹' + y.sailing_price.toLocaleString('en-IN'),
        rawPrice: y.sailing_price,
      },
      {
        label: '2 HOURS TRIP',
        duration: '2 Hrs',
        price: '₹' + y.sailing_price_2hr.toLocaleString('en-IN'),
        rawPrice: y.sailing_price_2hr,
      },
    ],
    images: unique.length
      ? unique
      : [
          'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=2070&auto=format&fit=crop',
        ],
    whyChoose: '',
    inclusions: [],
    exclusions: [],
    highlights: [],
    bestFor: [],
  };
}

/* ── Range slider component ───────────────────────────────────── */
function RangeSlider({
  label,
  icon,
  min,
  max,
  step,
  value,
  onChange,
  format,
  showPlusAtMax = false,
}: {
  label: string;
  icon: React.ReactNode;
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onChange: (v: [number, number]) => void;
  format: (n: number) => string;
  showPlusAtMax?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const activeThumb = useRef<'low' | 'high' | null>(null);

  const pct = (n: number) => ((n - min) / (max - min)) * 100;

  function getValFromPointer(clientX: number): number {
    if (!trackRef.current) return min;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const raw = min + ratio * (max - min);
    return Math.round(raw / step) * step;
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    const v = getValFromPointer(e.clientX);
    const lowDist = Math.abs(v - value[0]);
    const highDist = Math.abs(v - value[1]);
    if (lowDist <= highDist) {
      activeThumb.current = 'low';
      onChange([Math.min(Math.max(v, min), value[1] - step), value[1]]);
    } else {
      activeThumb.current = 'high';
      onChange([value[0], Math.max(Math.min(v, max), value[0] + step)]);
    }
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!activeThumb.current) return;
    const v = getValFromPointer(e.clientX);
    if (activeThumb.current === 'low') {
      onChange([Math.min(Math.max(v, min), value[1] - step), value[1]]);
    } else {
      onChange([value[0], Math.max(Math.min(v, max), value[0] + step)]);
    }
  }

  function handlePointerUp() {
    activeThumb.current = null;
  }

  return (
    <div className="flex-1 min-w-[220px]">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="text-[13px] font-bold text-[#1A3C35] uppercase tracking-wide">
          {label}
        </span>
      </div>
      <div className="px-2.5">
        {/* Track */}
        <div
          ref={trackRef}
          className="relative h-2 rounded-full bg-gray-200 cursor-grab active:cursor-grabbing select-none"
          style={{ touchAction: 'none' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* Discrete Ticks for guest-like sliders */}
          {step === 1 && (
            <div className="absolute inset-0 flex justify-between pointer-events-none">
              {Array.from({ length: max - min + 1 }).map((_, i) => (
                <div
                  key={i}
                  className="w-px h-full bg-gray-300"
                  style={{ opacity: 0.5 }}
                />
              ))}
            </div>
          )}
          {/* Active fill */}
          <div
            className="absolute h-2 rounded-full bg-[#3D9B7D] pointer-events-none"
            style={{ left: `${pct(value[0])}%`, right: `${100 - pct(value[1])}%` }}
          />
          {/* Low thumb */}
          <div
            className="absolute w-5 h-5 rounded-full bg-white border-2 border-[#3D9B7D] shadow-md pointer-events-none transition-transform"
            style={{ left: `${pct(value[0])}%`, top: '50%', transform: 'translate(-50%, -50%)' }}
          />
          {/* High thumb */}
          <div
            className="absolute w-5 h-5 rounded-full bg-white border-2 border-[#3D9B7D] shadow-md pointer-events-none transition-transform"
            style={{ left: `${pct(value[1])}%`, top: '50%', transform: 'translate(-50%, -50%)' }}
          />
        </div>
        {/* Min / Max labels */}
        <div className="flex justify-between items-center mt-3 gap-2">
          <span className="text-[11px] text-gray-500 font-medium bg-gray-100 rounded-lg px-2.5 py-1 whitespace-nowrap">
            From&nbsp;
            <span className="font-bold text-[#1A3C35]">{format(value[0])}</span>
          </span>
          <span className="text-gray-300 text-xs">—</span>
          <span className="text-[11px] text-gray-500 font-medium bg-gray-100 rounded-lg px-2.5 py-1 whitespace-nowrap">
            To&nbsp;
            <span className="font-bold text-[#1A3C35]">
              {format(value[1])}
              {showPlusAtMax && value[1] >= max ? '+' : ''}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Main page ────────────────────────────────────────────────── */
function FleetContent() {
  const searchParams = useSearchParams();

  const [allYachts, setAllYachts] = useState<Yacht[]>([]);
  const [loading, setLoading] = useState(true);

  /* ── Price & guest bounds (computed after data loads) ── */
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [guestRange, setGuestRange] = useState<[number, number]>([2, 60]);
  const [priceMax, setPriceMax] = useState(100000);
  const guestMax = 60;
  const [filtersVisible, setFiltersVisible] = useState(false);

  /* ── Fetch yachts ── */
  useEffect(() => {
    fetch('/api/yachts-master')
      .then((r) => (r.ok ? r.json() : { yachts: [] }))
      .then((data) => {
        const list: DBYacht[] = Array.isArray(data) ? data : data.yachts || [];
        const active = list
          .filter((y) => y.is_active)
          .sort((a, b) => a.sort_order - b.sort_order)
          .map(dbToCard);

        setAllYachts(active);

        if (active.length) {
          const maxPrice = Math.max(...active.map((y) => y.rawPrice));
          const roundedMaxPrice = Math.ceil(maxPrice / 5000) * 5000;

          setPriceMax(roundedMaxPrice);
          setPriceRange([0, roundedMaxPrice]);
          setGuestRange([2, 60]);
        }
      })
      .catch(() => setAllYachts([]))
      .finally(() => setLoading(false));
  }, []);

  /* ── Apply filters ── */
  const filteredYachts = useMemo(() => {
    return allYachts.filter((y) => {
      const priceOk = y.rawPrice >= priceRange[0] && y.rawPrice <= priceRange[1];
      const guestMin = guestRange[0];
      const guestMaxVal = guestRange[1];
      const guestOk =
        y.capacity >= guestMin && (guestMaxVal >= guestMax ? true : y.capacity <= guestMaxVal);
      return priceOk && guestOk;
    });
  }, [allYachts, priceRange, guestRange, guestMax]);

  /* ── Check if filters differ from defaults ── */
  const isFiltered =
    priceRange[0] > 0 || priceRange[1] < priceMax || guestRange[0] > 2 || guestRange[1] < guestMax;

  function resetFilters() {
    setPriceRange([0, priceMax]);
    setGuestRange([2, 60]);
  }

  /* ── Read query params passed from home page ── */
  useEffect(() => {
    const g = searchParams.get('guests');
    const p = searchParams.get('price');
    if (g || p) setFiltersVisible(true);
    // (future: pre-fill sliders from query params)
  }, [searchParams]);

  const formatPrice = (n: number) => `₹${(n / 1000).toFixed(0)}k`;
  const formatGuest = (n: number) => `${n}`;

  return (
    <div className="pt-28 pb-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* ── Heading ── */}
        <div className="relative text-center mb-10">
          <div className="absolute top-0 right-0 -translate-y-1/2 md:translate-y-0 z-20">
            <button
              onClick={() => setFiltersVisible((v) => !v)}
              className={`p-2.5 rounded-full shadow-md transition-all ${
                filtersVisible
                  ? 'bg-white text-[#1A3C35] border border-[#D0E8DF]'
                  : 'bg-[#1A3C35] text-white'
              }`}
              title={filtersVisible ? 'Hide Filters' : 'Filter Yachts'}
            >
              <SlidersHorizontal className="w-5 h-5" />
              {isFiltered && !filtersVisible && (
                <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-[#3D9B7D] ring-2 ring-white" />
              )}
            </button>
          </div>

          <AnimatedSection delay={0.1}>
            <p className="text-[#3D9B7D] font-bold uppercase tracking-widest text-xs mb-3">
              Our Fleet
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.3}>
            <h1 className="text-4xl md:text-5xl font-playfair-display font-bold text-[#1A3C35] mb-4 leading-tight">
              Book Yacht Based on Your
              <br className="hidden md:block" /> Group Size &amp; Budget
            </h1>
          </AnimatedSection>
        </div>

        {isFiltered && (
          <div className="flex justify-center mb-6">
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-400 hover:text-red-500 transition-colors"
            >
              <X className="w-4 h-4" /> Reset All Filters
            </button>
          </div>
        )}

        {/* ── Filter panel ── */}
        {filtersVisible && (
          <div className="bg-[#F8FAFA] border border-[#D0E8DF] rounded-2xl p-6 md:p-8 mb-10 shadow-sm">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12">
              <RangeSlider
                label="Guests"
                icon={<Users className="w-4 h-4 text-[#3D9B7D]" />}
                min={2}
                max={60}
                step={1}
                value={guestRange}
                onChange={setGuestRange}
                format={formatGuest}
                showPlusAtMax={true}
              />
              <div className="hidden md:block w-px bg-[#D0E8DF]" />
              <RangeSlider
                label="Price / Hour"
                icon={<IndianRupee className="w-4 h-4 text-[#3D9B7D]" />}
                min={0}
                max={priceMax}
                step={1000}
                value={priceRange}
                onChange={setPriceRange}
                format={formatPrice}
              />
            </div>
            <div className="mt-5 pt-5 border-t border-[#D0E8DF] flex items-center justify-between flex-wrap gap-3">
              <p className="text-[13px] text-gray-500 font-medium">
                Showing <span className="font-bold text-[#1A3C35]">{filteredYachts.length}</span> of{' '}
                {allYachts.length} yachts
              </p>
              <button
                onClick={resetFilters}
                className="text-[13px] font-semibold text-[#3D9B7D] hover:text-[#1A3C35] underline underline-offset-2 transition-colors"
              >
                Show All Yachts
              </button>
            </div>
          </div>
        )}

        {/* ── Yacht Grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-100 rounded-2xl h-[500px]" style={{ opacity: 0.6 }} />
            ))}
          </div>
        ) : filteredYachts.length === 0 && allYachts.length > 0 ? (
          /* No results state */
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-[#1A3C35] mb-2">No yachts match your filters</h3>
            <p className="text-gray-400 mb-6 text-[14px]">
              Try adjusting the guest count or price range.
            </p>
            <button
              onClick={resetFilters}
              className="bg-[#3D9B7D] text-white rounded-xl px-8 py-3 font-bold text-[14px] hover:bg-[#2A6655] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredYachts.map((yacht, i) => (
              <AnimatedSection key={yacht.id} delay={0.1 * (i % 3)}>
                <YachtCard yacht={yacht} />
              </AnimatedSection>
            ))}
          </div>
        )}

        {/* ── Custom charter CTA ── */}
        <div className="mt-24 relative overflow-hidden rounded-3xl bg-[#1A3C35] text-white">
          <div className="absolute inset-0 opacity-10">
            <img
              src="https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=2070&auto=format&fit=crop"
              className="w-full h-full object-cover"
              alt=""
            />
          </div>
          <div className="relative z-10 px-8 md:px-16 py-14 md:py-16 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="text-center md:text-left max-w-xl">
              <p className="text-[#3D9B7D] font-bold uppercase tracking-widest text-xs mb-4">
                Custom Charter
              </p>
              <h2 className="text-3xl md:text-4xl font-playfair-display font-bold mb-4 leading-snug">
                Looking for Something Specific?
              </h2>
              <p className="text-white/70 text-[15px] leading-relaxed">
                We are constantly expanding our fleet. If you don't see the perfect yacht for your
                occasion, contact us and we'll help you find a custom solution.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2.5 bg-[#3D9B7D] hover:bg-[#2A6655] text-white rounded-xl px-8 py-4 text-[14px] font-bold transition-all whitespace-nowrap"
              >
                <Phone className="w-4 h-4" />
                Enquire for Custom Options
              </Link>
              <a
                href="https://wa.me/919876543210?text=Hi%20Goaboatworld!%20I%20need%20help%20finding%20a%20custom%20yacht%20charter."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1db954] text-white rounded-xl px-8 py-4 text-[14px] font-bold transition-all whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FleetSkeleton() {
  return (
    <div className="pt-28 pb-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <div className="bms-skeleton h-4 w-20 mx-auto mb-3 rounded" />
          <div className="bms-skeleton h-12 w-96 mx-auto mb-4 rounded" />
          <div className="bms-skeleton h-5 w-72 mx-auto rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bms-skeleton rounded-2xl h-[500px]" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function FleetPage() {
  return (
    <Suspense fallback={<FleetSkeleton />}>
      <FleetContent />
    </Suspense>
  );
}
